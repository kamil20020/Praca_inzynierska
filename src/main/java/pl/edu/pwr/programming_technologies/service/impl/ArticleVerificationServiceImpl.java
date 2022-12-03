package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.entity.*;
import pl.edu.pwr.programming_technologies.repository.*;
import pl.edu.pwr.programming_technologies.service.ArticleService;
import pl.edu.pwr.programming_technologies.service.ArticleVerificationService;
import pl.edu.pwr.programming_technologies.service.UserService;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleVerificationServiceImpl implements ArticleVerificationService {

    private final ArticleVerificationRepository articleVerificationRepository;
    private final ArticleService articleService;
    private final UserService userService;

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
        if(!userService.existsById(reviewerId)){
            throw new EntityNotFoundException("Nie istnieje recenzent o takim id");
        }

        return articleVerificationRepository.findAllByUserEntityIdAndStatus(
            reviewerId, ArticleVerificationEntity.Status.CREATED, pageable
        );
    }

    @Transactional
    @Override
    public void assignArticleToReviewer(UserEntity reviewerEntity, ObjectId articleId) throws EntityNotFoundException{

        ArticleEntity foundArticleEntity = articleService.getArticleById(articleId);

        articleVerificationRepository.save(
            ArticleVerificationEntity.builder()
                .articleId(foundArticleEntity.getId().toHexString())
                .userEntity(reviewerEntity)
                .status(ArticleVerificationEntity.Status.CREATED)
                .assignmentDate(LocalDateTime.now())
                .build()
        );

        foundArticleEntity.setStatus(ArticleEntity.Status.VERIFICATION);
    }

    @Transactional
    @Override
    public void tryAssignArticlesToVerification(){

        List<ArticleEntity> toVerificationArticles = articleService.getArticlesDuringAssigningToVerification();

        if(toVerificationArticles.isEmpty()){
            return;
        }

        List<UserEntity> availableReviewers = userService.getAvailableReviewers();

        if(availableReviewers.isEmpty()){
            return;
        }

        List<Integer> verifiedReviewersArticles = availableReviewers.stream()
            .map(reviewer -> countVerifiedArticlesInLast30DaysByReviewerId(reviewer.getId()))
            .collect(Collectors.toList());

        toVerificationArticles.forEach((articleEntity) -> {

            if(articleVerificationRepository.existsByArticleIdAndStatus(
                articleEntity.getId().toHexString(),
                ArticleVerificationEntity.Status.CREATED
            )){
                return;
            }

            int min = Integer.MAX_VALUE;
            int reviewerIndex = -1;

            for(int i=0; i < verifiedReviewersArticles.size(); i++){

                Integer numberOfVerifiedArticles = verifiedReviewersArticles.get(i);

                if(numberOfVerifiedArticles < min){
                    min = numberOfVerifiedArticles;
                    reviewerIndex = i;
                }
            }

            assignArticleToReviewer(availableReviewers.get(reviewerIndex), articleEntity.getId());
        });
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

    @Transactional
    @Override
    public void updateArticlesVerification() throws EntityNotFoundException{

        LocalDateTime actualDate = LocalDateTime.now();

        articleVerificationRepository.findAllByStatus(ArticleVerificationEntity.Status.CREATED)
            .forEach(articleVerificationEntity -> {
                if(articleVerificationEntity.getAssignmentDate().plusDays(7).isBefore(actualDate)){
                    articleVerificationEntity.setStatus(ArticleVerificationEntity.Status.EXPIRED);

                    String articleIdStr = articleVerificationEntity.getArticleId();
                    ObjectId articleId = new ObjectId(articleIdStr);
                    ArticleEntity foundArticleEntity = articleService.getArticleById(articleId);
                    foundArticleEntity.setStatus(ArticleEntity.Status.ASSIGNING_TO_VERIFICATION);
                }
            });
    }

    @Override
    public int countVerifiedArticlesInLast30DaysByReviewerId(Integer reviewerId) {

        return articleVerificationRepository.countByUserEntityIdAndVerificationDateAfter(
            reviewerId, LocalDateTime.now().minusDays(30)
        );
    }
}
