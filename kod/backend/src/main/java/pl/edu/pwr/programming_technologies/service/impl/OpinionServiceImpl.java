package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateOpinion;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.OpinionRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.OpinionService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpinionServiceImpl implements OpinionService {

    private final OpinionRepository opinionRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Override
    public boolean existsByUserId(Integer userId) {

        return opinionRepository.existsByAuthorId(userId);
    }

    @Override
    public Integer getUserAcceptance(ObjectId opinionId, Integer userId) throws EntityNotFoundException{

        Optional<OpinionEntity> foundOpinionEntityOpt = opinionRepository.findById(opinionId);

        if(foundOpinionEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje opinia o takim id");
        }

        if(!userRepository.existsById(userId)){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        List<OpinionEntity.Acceptance> foundOpinionAcceptancesByAuthorId = foundOpinionEntityOpt.get()
            .getAcceptanceList().stream()
            .filter(acceptance -> acceptance.getAuthorId() == userId)
            .collect(Collectors.toList());

        if(foundOpinionAcceptancesByAuthorId.isEmpty()){
            return 0;
        }

        return foundOpinionAcceptancesByAuthorId.get(0).getValue();
    }

    @Override
    public List<OpinionEntity> getByArticleId(ObjectId articleId) throws EntityNotFoundException{

        if(!articleRepository.existsById(articleId)){
            throw new EntityNotFoundException("Nie istnieje artykuł o takim id");
        }

        return opinionRepository.findAllByArticleId(articleId);
    }

    @Override
    public OpinionEntity createOpinion(OpinionEntity opinionEntity) {

        if(opinionEntity.getAuthorId() == null){
            throw new IllegalArgumentException("Nie podano id autora");
        }

        if(!userRepository.existsById(opinionEntity.getAuthorId())){
            throw new EntityNotFoundException("Nie istnieje autor o takim id");
        }

        if(opinionEntity.getArticleId() == null){
            throw new IllegalArgumentException("Nie podano id artykułu");
        }

        if(!articleRepository.existsById(opinionEntity.getArticleId())){
            throw new EntityNotFoundException("Nie istnieje autor o takim id");
        }

        if(opinionRepository.existsByAuthorIdAndArticleId(opinionEntity.getAuthorId(), opinionEntity.getArticleId())){
            throw new EntityConflictException("Istnieje już opinia tego użytkownika o tym artykule");
        }

        if(opinionEntity.getRating() == null){
            throw new IllegalArgumentException("Nie podano oceny");
        }

        if(opinionEntity.getRating() < 1 || opinionEntity.getRating() > 5){
            throw new IllegalArgumentException("Podano ocenę ze złego zakresu");
        }

        if(opinionEntity.getContent() == null){
            throw new IllegalArgumentException("Nie podano zawartości opinii");
        }

        OpinionEntity toCreateOpinionEntity = OpinionEntity.builder()
            .authorId(opinionEntity.getAuthorId())
            .articleId(opinionEntity.getArticleId())
            .rating(opinionEntity.getRating())
            .content(opinionEntity.getContent())
            .creationDate(LocalDateTime.now())
            .modificationDate(LocalDateTime.now())
            .acceptanceList(new ArrayList<>())
            .positiveAcceptancesCount(0)
            .negativeAcceptancesCount(0)
        .build();

        ArticleEntity foundArticleEntity = articleRepository.findById(opinionEntity.getArticleId()).get();

        if(foundArticleEntity.getAverageRating() == null){
            foundArticleEntity.setAverageRating(Double.valueOf(toCreateOpinionEntity.getRating()));
        }
        else{

            AtomicReference<Double> sumOfRatings = new AtomicReference<>(Double.valueOf(0));

            List<OpinionEntity> articleOpinions = getByArticleId(foundArticleEntity.getId());

            articleOpinions.stream().forEach(opinionEntity1 -> {
                sumOfRatings.updateAndGet(v -> v + opinionEntity1.getRating());
            });

            foundArticleEntity.setAverageRating(sumOfRatings.get() / articleOpinions.size());
        }

        articleRepository.save(foundArticleEntity);

        return opinionRepository.save(toCreateOpinionEntity);
    }

    @Override
    public OpinionEntity updateOpinionById(ObjectId id, UpdateOpinion updateOpinion) throws IllegalArgumentException {

        if(updateOpinion == null){
            throw new IllegalArgumentException("Nie podano danych opinii");
        }

        Optional<OpinionEntity> foundOpinionOpt = opinionRepository.findById(id);

        if(foundOpinionOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje opinia o takim id");
        }

        OpinionEntity foundOpinion = foundOpinionOpt.get();

        if(updateOpinion.getRating() != null){

            if(updateOpinion.getRating() < 1 || updateOpinion.getRating() > 5){
                throw new IllegalArgumentException("Podano ocenę ze złego zakresu");
            }

            foundOpinion.setRating(updateOpinion.getRating());
        }

        if(updateOpinion.getContent() != null){
            foundOpinion.setContent(updateOpinion.getContent());
        }

        foundOpinion.setModificationDate(LocalDateTime.now());

        ArticleEntity foundArticleEntity = articleRepository.findById(foundOpinion.getArticleId()).get();

        AtomicReference<Double> sumOfRatings = new AtomicReference<>(Double.valueOf(0));

        List<OpinionEntity> articleOpinions = getByArticleId(foundArticleEntity.getId());

        articleOpinions.stream().forEach(opinionEntity1 -> {
            sumOfRatings.updateAndGet(v -> v + opinionEntity1.getRating());
        });

        foundArticleEntity.setAverageRating(sumOfRatings.get() / articleOpinions.size());

        articleRepository.save(foundArticleEntity);

        return opinionRepository.save(foundOpinion);
    }

    @Override
    public void deleteById(ObjectId id) throws EntityNotFoundException{

        Optional<OpinionEntity> foundOpinionEntity = opinionRepository.findById(id);

        if(foundOpinionEntity.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje opinia o takim id");
        }

        opinionRepository.deleteById(id);

        ArticleEntity foundArticleEntity = articleRepository.findById(foundOpinionEntity.get().getArticleId()).get();

        List<OpinionEntity> articleOpinions = getByArticleId(foundArticleEntity.getId());

        if(articleOpinions.isEmpty()){
            foundArticleEntity.setAverageRating(null);
        }
        else{
            AtomicReference<Double> sumOfRatings = new AtomicReference<>(Double.valueOf(0));

            articleOpinions.stream().forEach(opinionEntity1 -> {
                sumOfRatings.updateAndGet(v -> v + opinionEntity1.getRating());
            });

            foundArticleEntity.setAverageRating(sumOfRatings.get() / articleOpinions.size());
        }

        articleRepository.save(foundArticleEntity);
    }
}
