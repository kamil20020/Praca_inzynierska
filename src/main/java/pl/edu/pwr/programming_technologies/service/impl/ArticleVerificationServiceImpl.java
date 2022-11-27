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
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final TechnologyExpertRepository technologyExpertRepository;
    private final TechnologyRepository technologyRepository;
    private final ArticleService articleService;

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

    @Override
    public UserEntity getReviewerWithLowestNumberOfReviewedArticles(List<UserEntity> reviewers){

        int lowestNumberOfReviewedArticles = Integer.MAX_VALUE;
        UserEntity reviewerWithLowestNumberOfReviewedArticles = null;

        for(int i=0; i < reviewers.size(); i++){

            UserEntity reviewer = reviewers.get(i);

            int numberOfReviewedArticles =
                    articleVerificationRepository.countAllByUserEntityIdAndStatusOrStatus(
                            reviewer.getId(),
                            ArticleVerificationEntity.Status.ACCEPTED,
                            ArticleVerificationEntity.Status.REJECTED
                    );

            if(numberOfReviewedArticles < lowestNumberOfReviewedArticles){
                lowestNumberOfReviewedArticles = numberOfReviewedArticles;
                reviewerWithLowestNumberOfReviewedArticles = reviewer;
            }
        }

        return reviewerWithLowestNumberOfReviewedArticles;
    }

    @Transactional
    @Override
    public void assignArticleToReviewer(UserEntity reviewerEntity, ObjectId articleId){

        ArticleEntity foundArticleEntity = articleRepository.findById(articleId).get();

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

        List<ArticleEntity> toVerificationArticles = articleRepository.findAllByStatusOrStatus(
                ArticleEntity.Status.NEW, ArticleEntity.Status.ASSIGNING_TO_VERIFICATION
        );

        toVerificationArticles.forEach(articleEntity -> {

            boolean isArticleAssigned = false;

            if(articleVerificationRepository.existsByArticleIdAndStatus(
                    articleEntity.getId().toHexString(),
                    ArticleVerificationEntity.Status.CREATED
            )){
                return;
            }

            List<TechnologyExpertEntity> technologyExpertsWithTechnology =
                    technologyExpertRepository.findAllByTechnologyEntityIdAndUserEntityIdNot(
                            articleEntity.getTechnologyId(), articleEntity.getAuthorId()
                    );

            if (!technologyExpertsWithTechnology.isEmpty()) {

                UserEntity reviewerWithLowestNumberOfReviewerArticles =
                        getReviewerWithLowestNumberOfReviewedArticles(
                                technologyExpertsWithTechnology.stream()
                                        .map(technologyExpertEntity -> technologyExpertEntity.getUserEntity())
                                        .collect(Collectors.toList())
                        );

                assignArticleToReviewer(reviewerWithLowestNumberOfReviewerArticles, articleEntity.getId());
                isArticleAssigned = true;
            } else {

                TechnologyCategoryEntity articleTechnologyCategoryEntity = technologyRepository.findById(
                        articleEntity.getTechnologyId()
                ).get().getTechnologyCategoryEntity();

                while (true) {

                    List<TechnologyExpertEntity> foundTechnologyExperts =
                            technologyExpertRepository.findAllByTechnologyEntityTechnologyCategoryEntityIdAndUserEntityIdNot(
                                    articleTechnologyCategoryEntity.getId(), articleEntity.getAuthorId()
                            );

                    if (!foundTechnologyExperts.isEmpty()) {

                        UserEntity reviewerWithLowestNumberOfReviewerArticles =
                                getReviewerWithLowestNumberOfReviewedArticles(
                                        foundTechnologyExperts.stream()
                                                .map(technologyExpertEntity -> technologyExpertEntity.getUserEntity())
                                                .collect(Collectors.toList())
                                );

                        assignArticleToReviewer(reviewerWithLowestNumberOfReviewerArticles, articleEntity.getId());
                        isArticleAssigned = true;
                        break;
                    }

                    if (articleTechnologyCategoryEntity.getParentTechnologyCategoryEntity() == null) {
                        break;
                    }

                    articleTechnologyCategoryEntity =
                            articleTechnologyCategoryEntity.getParentTechnologyCategoryEntity();
                }
            }

            if(!isArticleAssigned && articleEntity.getStatus().toString().equals(ArticleEntity.Status.NEW)){

                articleService.updateArticleStatus(
                    articleEntity.getId(), ArticleEntity.Status.ASSIGNING_TO_VERIFICATION
                );
            }
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
    public void updateArticlesVerification(){

        LocalDateTime actualDate = LocalDateTime.now();

        articleVerificationRepository.findAllByStatus(ArticleVerificationEntity.Status.CREATED)
            .forEach(articleVerificationEntity -> {
                if(articleVerificationEntity.getAssignmentDate().plusDays(7).isBefore(actualDate)){
                    articleVerificationEntity.setStatus(ArticleVerificationEntity.Status.EXPIRED);

                    String articleIdStr = articleVerificationEntity.getArticleId();
                    ObjectId articleId = new ObjectId(articleIdStr);
                    ArticleEntity foundArticleEntity = articleRepository.findById(articleId).get();
                    foundArticleEntity.setStatus(ArticleEntity.Status.ASSIGNING_TO_VERIFICATION);
                }
            });
    }
}
