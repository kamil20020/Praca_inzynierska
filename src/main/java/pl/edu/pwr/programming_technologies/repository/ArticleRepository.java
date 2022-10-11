package pl.edu.pwr.programming_technologies.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;

@Repository
public interface ArticleRepository extends MongoRepository <ArticleEntity, ObjectId> {

    boolean existsByTitleIgnoreCase(String title);
}
