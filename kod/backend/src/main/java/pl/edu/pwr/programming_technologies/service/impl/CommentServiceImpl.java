package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.api.request.CreateComment;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateComment;
import pl.edu.pwr.programming_technologies.model.entity.CommentEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.CommentRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.CommentService;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Override
    public Page<CommentEntity> getSubComments(ObjectId articleId, ObjectId parentCommentId, Pageable pageable) {
        return commentRepository.findAllByArticleIdAndParentCommentIdOrderByModificationDateDesc(articleId, parentCommentId, pageable);
    }

    @Override
    public Page<CommentEntity> getSubComments(ObjectId parentCommentId, Pageable pageable) {
        return commentRepository.findAllByParentCommentIdOrderByModificationDateDesc(parentCommentId, pageable);
    }

    @Override
    public CommentEntity createComment(CreateComment createComment)
            throws IllegalArgumentException, EntityNotFoundException
    {
        if(createComment.getAuthorId() == null){
            throw new IllegalArgumentException("Nie podano id artykułu");
        }

        if(createComment.getAuthorId() == null){
            throw new IllegalArgumentException("Nie podano id autora komentarza");
        }

        if(createComment.getContent() == null){
            throw new IllegalArgumentException("Nie podano zawartości komentarza");
        }

        ObjectId articleId;
        ObjectId parentCommentId = null;

        try{
            articleId = new ObjectId(createComment.getArticleId());
        }
        catch(IllegalArgumentException e) {
            throw new IllegalArgumentException("Podano niewłaściwe id artykułu");
        }

        if(!articleRepository.existsById(articleId)){
            throw new EntityNotFoundException("Nie istnieje artykuł o takim id");
        }

        if(createComment.getParentCommentId() != null){

            try{
                parentCommentId = new ObjectId(createComment.getParentCommentId());
            }
            catch(IllegalArgumentException e){
                throw new IllegalArgumentException("Podano niewłaściwe id nadrzędnego komentarza");
            }

            if(!commentRepository.existsById(parentCommentId)){
                throw new EntityNotFoundException("Nie istnieje nadrzędny komentarz o takim id");
            }
        }

        if(!userRepository.existsById(createComment.getAuthorId())){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        CommentEntity newCommentEntity = CommentEntity.builder()
            .articleId(articleId)
            .parentCommentId(parentCommentId)
            .authorId(createComment.getAuthorId())
            .content(createComment.getContent())
            .creationDate(LocalDateTime.now())
            .modificationDate(LocalDateTime.now())
            .build();

        return commentRepository.save(newCommentEntity);
    }

    @Override
    public CommentEntity updateCommentById(ObjectId commentId, UpdateComment updateComment)
        throws IllegalArgumentException, EntityNotFoundException
    {
        if(updateComment == null){
            throw new IllegalArgumentException("Nie podano danych komentarza");
        }

        Optional<CommentEntity> foundCommentEntityOpt = commentRepository.findById(commentId);

        if(foundCommentEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje komentarz o takim id");
        }

        CommentEntity foundCommentEntity = foundCommentEntityOpt.get();

        if(foundCommentEntity.getContent() != null){
            foundCommentEntity.setContent(updateComment.getContent());
        }

        return commentRepository.save(foundCommentEntity);
    }

    public void deleteChildrenComments(ObjectId commentId){

        List<CommentEntity> subComments = commentRepository.findAllByParentCommentId(commentId);
        subComments.forEach(c -> {
            deleteChildrenComments(c.getId());
        });

        commentRepository.deleteById(commentId);
    }

    @Override
    public void deleteCommentById(ObjectId commentId) throws EntityNotFoundException{

        if(!commentRepository.existsById(commentId)){
            throw new EntityNotFoundException("Nie istnieje komentarz o takim id");
        }

        deleteChildrenComments(commentId);
    }
}
