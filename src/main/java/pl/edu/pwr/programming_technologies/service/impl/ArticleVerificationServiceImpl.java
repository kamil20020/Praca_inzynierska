package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleVerificationRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleService;
import pl.edu.pwr.programming_technologies.service.ArticleVerificationService;

import javax.transaction.Transactional;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleVerificationServiceImpl implements ArticleVerificationService {

    private final ArticleVerificationRepository articleVerificationRepository;
    private final ArticleService articleService;
    private final UserRepository userRepository;

    @Override
    public ArticleVerificationEntity getById(Integer articleVerificationId) throws EntityNotFoundException{

        Optional<ArticleVerificationEntity> foundArticleVerificationEntityOpt = articleVerificationRepository.findById(
            articleVerificationId
        );

        if(foundArticleVerificationEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje weryfikacja artykułu o takim id");
        }

        return foundArticleVerificationEntityOpt.get();
    }

    @Override
    public Page<ArticleVerificationEntity> getCreatedArticleVerificationsByReviewerId(
        Integer reviewerId, Pageable pageable
    )
        throws EntityNotFoundException
    {
        if(!userRepository.existsById(reviewerId)){
            throw new EntityNotFoundException("Nie istnieje recenzent o takim id");
        }

        return articleVerificationRepository.findAllByUserEntityIdAndStatus(
            reviewerId, ArticleVerificationEntity.Status.CREATED, pageable
        );
    }

    @Transactional
    @Override
    public void changeArticleVerificationStatusById(
            Integer articleVerificationId, ArticleVerificationEntity.Status articleVerificationStatus,
            String feedback)
        throws EntityNotFoundException
    {
        Optional<ArticleVerificationEntity> foundArticleVerificationEntityOpt = articleVerificationRepository.findById(
            articleVerificationId
        );

        if(foundArticleVerificationEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje weryfkacja artykułu o podanym id");
        }

        ArticleVerificationEntity foundArticleVerificationEntity = foundArticleVerificationEntityOpt.get();

        foundArticleVerificationEntity.setStatus(articleVerificationStatus);

        if(!feedback.isBlank()){
            foundArticleVerificationEntity.setVerificationFeedback(feedback);
        }

        switch(articleVerificationStatus){
            case ACCEPTED -> {
                articleService.updateArticleStatus(
                    new ObjectId(foundArticleVerificationEntity.getArticleId()), ArticleEntity.Status.PUBLISHED
                );

                break;
            }
            case REJECTED -> {
                articleService.updateArticleStatus(
                    new ObjectId(foundArticleVerificationEntity.getArticleId()), ArticleEntity.Status.REFUSED
                );
            }
        }
    }
}
