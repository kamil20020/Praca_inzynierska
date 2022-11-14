package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;

@Repository
public interface ArticleVerificationRepository extends JpaRepository <ArticleVerificationEntity, Integer> {

    Page<ArticleVerificationEntity> findAllByUserEntityIdAndStatus(
        Integer userEntityId, ArticleVerificationEntity.Status articleVerificationStatus, Pageable pageable
    );
}
