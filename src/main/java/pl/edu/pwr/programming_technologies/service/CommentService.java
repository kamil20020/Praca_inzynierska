package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.edu.pwr.programming_technologies.model.api.request.CreateComment;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateComment;
import pl.edu.pwr.programming_technologies.model.entity.CommentEntity;

import java.util.List;

public interface CommentService {

    Page<CommentEntity> getSubComments(ObjectId articleId, ObjectId parentCommentId, Pageable pageable);
    Page<CommentEntity> getSubComments(ObjectId parentCommentId, Pageable pageable);
    CommentEntity createComment(CreateComment createComment);
    CommentEntity updateCommentById(ObjectId commentId, UpdateComment updateComment);
    void deleteCommentById(ObjectId commentId);
}
