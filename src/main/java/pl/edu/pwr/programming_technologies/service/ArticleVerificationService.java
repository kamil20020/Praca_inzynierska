package pl.edu.pwr.programming_technologies.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;

public interface ArticleVerificationService {

    ArticleVerificationEntity getById(Integer articleVerificationId);
    Page<ArticleVerificationEntity> getCreatedArticleVerificationsByReviewerId(Integer reviewerId, Pageable pageable);
    void changeArticleVerificationStatusById(
            Integer articleVerificationId, ArticleVerificationEntity.Status articleVerificationStatus,
            String feedback);
}
