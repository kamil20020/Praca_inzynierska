package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.edu.pwr.programming_technologies.model.dto.SimpleArticleDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;

import java.util.List;

public interface ArticleService {

    Page<ArticleEntity> getAll(Pageable pageable);
    ArticleEntity getArticleById(ObjectId articleId);
    ArticleEntity addArticle(ArticleEntity articleEntity);
    ArticleEntity updateArticle(ArticleEntity articleEntity, ObjectId articleId);
}
