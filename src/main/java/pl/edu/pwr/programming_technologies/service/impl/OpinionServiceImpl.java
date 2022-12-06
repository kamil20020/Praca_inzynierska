package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateOpinion;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.OpinionRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleService;
import pl.edu.pwr.programming_technologies.service.OpinionService;
import pl.edu.pwr.programming_technologies.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
            return 0;
        }

        return foundOpinionEntityOpt.get().getAcceptanceList().stream()
            .filter(acceptance -> acceptance.getAuthorId() == userId)
            .collect(Collectors.toList()).get(0).getValue();
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
        .build();

        return opinionRepository.save(toCreateOpinionEntity);
    }

    @Override
    public OpinionEntity updateOpinionById(ObjectId id, UpdateOpinion updateOpinion) throws IllegalArgumentException {

        if(updateOpinion == null){
            throw new IllegalArgumentException("Nie podano danych opinii");
        }

        Optional<OpinionEntity> foundOpinionOpt = opinionRepository.findById(id);

        System.out.println("ABC");
        System.out.println(id.toHexString());

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

        return opinionRepository.save(foundOpinion);
    }

    @Override
    public void deleteById(ObjectId id) throws EntityNotFoundException{

        if(!opinionRepository.existsById(id)){
            throw new EntityNotFoundException("Nie istnieje opinia o takim id");
        }

        opinionRepository.deleteById(id);
    }
}
