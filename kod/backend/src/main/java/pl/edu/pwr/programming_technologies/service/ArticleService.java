package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.edu.pwr.programming_technologies.model.api.request.ArticleSearchCriteria;
import pl.edu.pwr.programming_technologies.model.api.request.CreateArticle;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateArticle;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;

import java.util.List;

public interface ArticleService {

    Page<ArticleEntity> searchByCriteria(
            ArticleSearchCriteria articleSearchCriteria, Pageable pageable, String role,
            String loggedUserId);
    ArticleEntity getArticleById(ObjectId articleId);
    Page<ArticleEntity> getAll(Pageable pageable);
    List<ArticleEntity> getArticlesDuringAssigningToVerification();
    ArticleEntity addArticle(CreateArticle createArticle);
    ArticleEntity updateArticle(ObjectId articleId, UpdateArticle updateArticle);
    void updateArticleStatus(ObjectId articleId, ArticleEntity.Status articleStatus);
    void deleteArticleById(ObjectId articleId);
}
