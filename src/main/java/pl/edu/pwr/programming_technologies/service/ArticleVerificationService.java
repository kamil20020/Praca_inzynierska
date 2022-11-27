package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleVerificationRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface ArticleVerificationService {

    ArticleVerificationEntity getById(Integer articleVerificationId);
    Page<ArticleVerificationEntity> getCreatedArticleVerificationsByReviewerId(Integer reviewerId, Pageable pageable);
    UserEntity getReviewerWithLowestNumberOfReviewedArticles(List<UserEntity> reviewers);
    void assignArticleToReviewer(UserEntity reviewerEntity, ObjectId articleId);

    void tryAssignArticlesToVerification();

    void changeArticleVerificationStatusById(
        Integer articleVerificationId, ArticleVerificationEntity.Status articleVerificationStatus, String feedback
    );

    void updateArticlesVerification();
}
