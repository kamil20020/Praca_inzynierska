package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ArticleVerificationRepository extends JpaRepository <ArticleVerificationEntity, Integer> {

    Page<ArticleVerificationEntity> findAllByUserEntityIdAndStatus(
        Integer userEntityId, ArticleVerificationEntity.Status articleVerificationStatus, Pageable pageable
    );

    List<ArticleVerificationEntity> findAllByStatus(ArticleVerificationEntity.Status articleVerificationStatus);
    int countAllByUserEntityIdAndStatusOrStatus(
        Integer userEntityId, ArticleVerificationEntity.Status status1, ArticleVerificationEntity.Status status2
    );
    boolean existsByArticleIdAndStatus(String articleId, ArticleVerificationEntity.Status status1);

    int countByUserEntityIdAndVerificationDateAfter(Integer reviewerId, LocalDateTime verificationDate);
}
