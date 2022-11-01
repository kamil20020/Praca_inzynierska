package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.edu.pwr.programming_technologies.model.api.request.ArticleSearchCriteria;
import pl.edu.pwr.programming_technologies.model.api.request.CreateArticle;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateArticle;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;

public interface ArticleService {

    Page<ArticleEntity> searchByCriteria(ArticleSearchCriteria articleSearchCriteria, Pageable pageable);
    Page<ArticleEntity> getAll(Pageable pageable);
    ArticleEntity getArticleById(ObjectId articleId);
    ArticleEntity addArticle(CreateArticle createArticle);
    ArticleEntity updateArticle(ObjectId articleId, UpdateArticle updateArticle);
    void deleteArticleById(ObjectId articleId);
}
