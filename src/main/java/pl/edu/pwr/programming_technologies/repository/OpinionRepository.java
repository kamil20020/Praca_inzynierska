package pl.edu.pwr.programming_technologies.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;

import java.util.List;

public interface OpinionRepository extends MongoRepository <OpinionEntity, ObjectId> {

    List<OpinionEntity> findAllByArticleId(ObjectId articleId);
    boolean existsByAuthorId(Integer authorId);
    boolean existsByAuthorIdAndArticleId(Integer authorId, ObjectId articleId);
}
