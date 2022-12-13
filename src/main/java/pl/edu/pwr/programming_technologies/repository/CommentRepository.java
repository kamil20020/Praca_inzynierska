package pl.edu.pwr.programming_technologies.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.CommentEntity;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository <CommentEntity, ObjectId> {

    Page<CommentEntity> findAllByArticleIdAndParentCommentIdOrderByModificationDateDesc(
        ObjectId articleId, ObjectId parentCommentId, Pageable pageable
    );
    Page<CommentEntity> findAllByParentCommentIdOrderByModificationDateDesc(
            ObjectId parentCommentId, Pageable pageable
    );
    List<CommentEntity> findAllByParentCommentId(ObjectId parentCommentId);
    void deleteAllByArticleId(ObjectId articleId);
}
