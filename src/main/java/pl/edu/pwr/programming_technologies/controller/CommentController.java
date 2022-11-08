package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.CommentMapper;
import pl.edu.pwr.programming_technologies.model.api.request.CreateComment;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateComment;
import pl.edu.pwr.programming_technologies.model.dto.CommentDTO;
import pl.edu.pwr.programming_technologies.model.entity.CommentEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.CommentService;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://technologie-programistyczne.netlify.app"})
@RequiredArgsConstructor
@RequestMapping(value = "/comment")
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper = CommentMapper.INSTANCE;
    private final UserRepository userRepository;

    @GetMapping("/subs/{parentCommentId}")
    public ResponseEntity getSubComments(
        @PathVariable("parentCommentId") String parentCommentIdStr, Pageable pageable
    ){
        ObjectId parentCommentId;

        try{
            parentCommentId = new ObjectId(parentCommentIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id komentarza");
        }

        if(pageable == null){
            pageable = Pageable.unpaged();
        }

        Page<CommentEntity> foundCommentEntityPage = commentService.getSubComments(parentCommentId, pageable);
        Page<CommentDTO> foundCommentDTOPage = foundCommentEntityPage.map(c ->
                commentMapper.commentEntityToCommentDTO(c, userRepository)
        );

        return ResponseEntity.ok(foundCommentDTOPage);
    }

    @PostMapping
    public ResponseEntity createComment(@RequestBody CreateComment createComment){

        CommentEntity createdCommentEntity;

        try{
            createdCommentEntity = commentService.createComment(createComment);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        CommentDTO createdCommentDTO = commentMapper.commentEntityToCommentDTO(createdCommentEntity, userRepository);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommentDTO);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity updateCommentById(
        @PathVariable("commentId") String commentIdStr, @RequestBody UpdateComment updateComment
    ){
        ObjectId commentId;

        try{
            commentId = new ObjectId(commentIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id komentarza");
        }

        CommentEntity updatedCommentEntity;

        try{
            updatedCommentEntity = commentService.updateCommentById(commentId, updateComment);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        CommentDTO updatedCommentDTO = commentMapper.commentEntityToCommentDTO(updatedCommentEntity, userRepository);

        return ResponseEntity.ok(updatedCommentDTO);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity deleteCommentById(@PathVariable("commentId") String commentIdStr){

        ObjectId commentId;

        try{
            commentId = new ObjectId(commentIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id komentarza");
        }

        try{
            commentService.deleteCommentById(commentId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
