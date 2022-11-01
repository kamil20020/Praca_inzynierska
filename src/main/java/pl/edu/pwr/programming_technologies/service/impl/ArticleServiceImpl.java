package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.api.request.ArticleSearchCriteria;
import pl.edu.pwr.programming_technologies.model.api.request.CreateArticle;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateArticle;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.CommentRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleService;
//import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;

    private final MongoTemplate mongoTemplate;

    private String toLikeRegex(String source) {
        return source.replaceAll("\\*", ".*");
    }

    public Page<ArticleEntity> searchByCriteria(ArticleSearchCriteria articleSearchCriteria, Pageable pageable){

        Query query = new Query();

        Criteria technologyIdCriteria = Criteria.where("technologyId");
        boolean addedTechnologyIdCriteria = false;
        List<Integer> lastCriteriaTechnologyIds = new ArrayList<>();
        Criteria creationDateCriteria = Criteria.where("creationDate");
        boolean addedCreationDateCriteria = false;
        Criteria modificationDateCriteria = Criteria.where("modificationDate");
        boolean addedModificationDateCriteria = false;

        if(articleSearchCriteria.getAuthorNickname() != null && !articleSearchCriteria.getAuthorNickname().isBlank()){
            List<Integer> foundAuthorsIds =
                userRepository.findAllByNicknameContainsIgnoreCase(articleSearchCriteria.getAuthorNickname())
                .stream()
                .map(u -> u.getId())
                .collect(Collectors.toList());

            if(foundAuthorsIds.isEmpty()){
                return new PageImpl<>(new ArrayList<>(), pageable, 0);
            }

            query.addCriteria(
                Criteria.where("authorId").in(foundAuthorsIds)
            );
        }

        if(articleSearchCriteria.getTechnologyId() != null){
            lastCriteriaTechnologyIds.add(articleSearchCriteria.getTechnologyId());
            addedTechnologyIdCriteria = true;
        }
        else{
            if(articleSearchCriteria.getTechnologyCategoryId() != null){
                List<Integer> foundTechnologyIds =
                        technologyRepository.findAllHavingTechnologyCategoryIdInTree(
                                articleSearchCriteria.getTechnologyCategoryId()
                        )
                            .stream()
                            .map(u -> u.getId())
                            .collect(Collectors.toList());

                if(foundTechnologyIds.isEmpty()){
                    return new PageImpl<>(new ArrayList<>(), pageable, 0);
                }

                lastCriteriaTechnologyIds = foundTechnologyIds;
                addedTechnologyIdCriteria = true;
            }
        }

        if(articleSearchCriteria.getTechnologyProvider() != null && !articleSearchCriteria.getTechnologyProvider().isBlank()){
            List<Integer> foundTechnologyIds =
                technologyRepository.findAllByProviderContainsIgnoreCase(articleSearchCriteria.getTechnologyProvider())
                .stream()
                .map(t -> t.getId())
                .collect(Collectors.toList());

            if(foundTechnologyIds.isEmpty()){
                return new PageImpl<>(new ArrayList<>(), pageable, 0);
            }

            addedTechnologyIdCriteria = true;

            if(!lastCriteriaTechnologyIds.isEmpty()){
                lastCriteriaTechnologyIds.retainAll(foundTechnologyIds);
            }
            else{
                lastCriteriaTechnologyIds = foundTechnologyIds;
            }
        }

        if(articleSearchCriteria.getTitle() != null && !articleSearchCriteria.getTitle().isBlank()){
            query.addCriteria(
                    Criteria.where("title").regex(articleSearchCriteria.getTitle(), "i")
            );
        }

        if(articleSearchCriteria.getFromCreationDate() != null){
            creationDateCriteria.gte(articleSearchCriteria.getFromCreationDate());
            addedCreationDateCriteria = true;
        }

        if(articleSearchCriteria.getToCreationDate() != null){
            creationDateCriteria.lte(articleSearchCriteria.getToCreationDate());
            addedCreationDateCriteria = true;
        }

        if(articleSearchCriteria.getFromModificationDate() != null){
            modificationDateCriteria.gte(articleSearchCriteria.getFromModificationDate());
            addedModificationDateCriteria = true;
        }

        if(articleSearchCriteria.getToModificationDate() != null){
            modificationDateCriteria.lte(articleSearchCriteria.getToModificationDate());
            addedModificationDateCriteria = true;
        }

        if(addedTechnologyIdCriteria){
            if(lastCriteriaTechnologyIds.isEmpty()){
                lastCriteriaTechnologyIds.add(-1);
            }
            query.addCriteria(technologyIdCriteria.in(lastCriteriaTechnologyIds));
        }

        if(addedCreationDateCriteria)
            query.addCriteria(creationDateCriteria);

        if(addedModificationDateCriteria)
            query.addCriteria(modificationDateCriteria);

        long totalElements = mongoTemplate.count(query, ArticleEntity.class);
        query.with(pageable);
        List<ArticleEntity> foundArticles = mongoTemplate.find(query, ArticleEntity.class);

        return new PageImpl<>(foundArticles, pageable, totalElements);
    }

    public Page<ArticleEntity> getAll(Pageable pageable){
        return articleRepository.findAll(pageable);
    }

    @Override
    public ArticleEntity getArticleById(ObjectId articleId) throws EntityNotFoundException{

        Optional<ArticleEntity> foundArticleOpt = articleRepository.findById(articleId);

        if(foundArticleOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje artykuł o takim id");
        }

        return foundArticleOpt.get();
    }

    @Override
    public ArticleEntity addArticle(CreateArticle createArticle)
            throws IllegalArgumentException, EntityConflictException, EntityNotFoundException {

        if (createArticle.getAuthorId() == null) {
            throw new IllegalArgumentException("Nie poddano id autora");
        }

        if (createArticle.getTechnologyId() == null) {
            throw new IllegalArgumentException("Nie poddano id technologii");
        }

        if (articleRepository.existsByTitleIgnoreCase(createArticle.getTitle())) {
            throw new EntityConflictException("Istnieje już artykuł o takim tytule");
        }

        if (!userRepository.existsById(createArticle.getAuthorId())) {
            throw new EntityNotFoundException("Nie istnieje autor o takim id");
        }

        if (!technologyRepository.existsById(createArticle.getTechnologyId())) {
            throw new EntityNotFoundException("Nie istnieje technologia o takim id");
        }

        ArticleEntity newArticleEntity = ArticleEntity.builder()
            .title(createArticle.getTitle())
            .authorId(createArticle.getAuthorId())
            .technologyId(createArticle.getTechnologyId())
            .content(createArticle.getContent())
            .status(ArticleEntity.Status._new)
            .creationDate(LocalDateTime.now())
            .modificationDate(LocalDateTime.now())
            .build();

        return articleRepository.save(newArticleEntity);
    }

    @Override
    public ArticleEntity updateArticle(ObjectId articleId, UpdateArticle updateArticle)
            throws IllegalArgumentException, EntityConflictException, EntityNotFoundException
    {
        if(updateArticle == null){
            throw new IllegalArgumentException("Nie podano danych artykułu");
        }

        Optional<ArticleEntity> foundArticleEntityOpt = articleRepository.findById(articleId);

        if(foundArticleEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje artykuł o takim id");
        }

        ArticleEntity foundArticleEntity = foundArticleEntityOpt.get();

        if(updateArticle.getTechnologyId() != null){
            foundArticleEntity.setTechnologyId(updateArticle.getTechnologyId());
        }

        if(updateArticle.getTitle() != null &&
            !updateArticle.getTitle().equals(foundArticleEntity.getTitle())
        ){

            if(articleRepository.existsByTitleIgnoreCase(updateArticle.getTitle())){
                throw new EntityConflictException("Istnieje już artykuł o takim tytule");
            }

            foundArticleEntity.setTitle(updateArticle.getTitle());
        }

        if(updateArticle.getContent() != null){

            if(updateArticle.getContent().isBlank()){
                throw new IllegalArgumentException("Artykuł nie może mieć pustej treści");
            }

            foundArticleEntity.setContent(updateArticle.getContent());
        }

        return articleRepository.save(foundArticleEntity);
    }

    @Override
    public void deleteArticleById(ObjectId articleId) throws EntityNotFoundException {

        if(!articleRepository.existsById(articleId)){
            throw new EntityNotFoundException("Nie istnieje artykuł o takim id");
        }

        articleRepository.deleteById(articleId);
        commentRepository.deleteAllByArticleId(articleId);
    }
}
