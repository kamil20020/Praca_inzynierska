package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.dto.SimpleArticleDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleService;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;

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
    public ArticleEntity addArticle(ArticleEntity articleEntity)
            throws IllegalArgumentException, EntityConflictException, EntityNotFoundException {
        if (articleEntity.getAuthorId() == null) {
            throw new IllegalArgumentException("Nie poddano id autora");
        }

        if (articleEntity.getTechnologyId() == null) {
            throw new IllegalArgumentException("Nie poddano id technologii");
        }

        if (articleRepository.existsByTitleIgnoreCase(articleEntity.getTitle())) {
            throw new EntityConflictException("Istnieje już artykuł o takim tytule");
        }

        if (!userRepository.existsById(articleEntity.getAuthorId())) {
            throw new EntityNotFoundException("Nie istnieje autor o takim id");
        }

        if (!technologyRepository.existsById(articleEntity.getTechnologyId())) {
            throw new EntityNotFoundException("Nie istnieje technologia o takim id");
        }

        return articleRepository.save(articleEntity);
    }

    @Override
    @Transactional
    public ArticleEntity updateArticle(ArticleEntity articleEntity, ObjectId articleId)
            throws IllegalArgumentException, EntityConflictException, EntityNotFoundException
    {
        Optional<ArticleEntity> foundArticleEntity = articleRepository.findById(articleId);

        if(foundArticleEntity.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje artykuł o takim id");
        }

        if(articleEntity.getTechnologyId() != null){

        }

        if(articleEntity.getTitle() != null){

        }

        if(articleEntity.getContent() != null){

        }

        return null;
    }
}
