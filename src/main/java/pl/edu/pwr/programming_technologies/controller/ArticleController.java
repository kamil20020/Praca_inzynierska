package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.ArticleMapper;
import pl.edu.pwr.programming_technologies.mapper.CommentMapper;
import pl.edu.pwr.programming_technologies.mapper.SearchCriteriaMapper;
import pl.edu.pwr.programming_technologies.model.api.request.ArticleSearchCriteria;
import pl.edu.pwr.programming_technologies.model.api.request.CreateArticle;
import pl.edu.pwr.programming_technologies.model.dto.ArticleDTO;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateArticle;
import pl.edu.pwr.programming_technologies.model.dto.ArticleSearchCriteriaDTO;
import pl.edu.pwr.programming_technologies.model.dto.CommentDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.CommentEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleService;
import pl.edu.pwr.programming_technologies.service.CommentService;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://technologie-programistyczne.netlify.app/"})
@RequiredArgsConstructor
@RequestMapping(value = "/article")
public class ArticleController {

    private final ArticleService articleService;
    private final CommentService commentService;
    private final CommentMapper commentMapper = CommentMapper.INSTANCE;
    private final ArticleMapper articleMapper = ArticleMapper.INSTANCE;
    private final SearchCriteriaMapper searchCriteriaMapper = SearchCriteriaMapper.INSTANCE;
    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;

    @PostMapping("/search")
    public ResponseEntity<Page<ArticleDTO>> searchByCriteria(
            @RequestBody ArticleSearchCriteriaDTO articleSearchCriteriaDTO, Pageable pageable
    ){
        if(pageable == null){
            pageable = Pageable.unpaged();
        }

        ArticleSearchCriteria articleSearchCriteria =
                searchCriteriaMapper.articleSearchCriteriaDTOToArticleSearchCriteria(articleSearchCriteriaDTO);

        Page<ArticleDTO> pageOfArticleDTOs = articleService.searchByCriteria(articleSearchCriteria, pageable)
                .map(a -> articleMapper.articleEntityToArticleDTO(a, userRepository, technologyRepository));

        return ResponseEntity.ok(pageOfArticleDTOs);
    }

    @GetMapping
    public ResponseEntity<Page<ArticleDTO>> getAll(Pageable pageable){

        if(pageable == null){
            pageable = Pageable.unpaged();
        }

        Page<ArticleEntity> articleEntityPage = articleService.getAll(pageable);
        List<ArticleDTO> articleDTOList = articleMapper.articleEntityListToArticleDTOList(
                articleEntityPage.getContent(), userRepository, technologyRepository
        );
        Page<ArticleDTO> articleDTOPage = new PageImpl<>(articleDTOList, pageable, articleEntityPage.getTotalElements());

        return ResponseEntity.ok(articleDTOPage);
    }

    @GetMapping("/{articleId}")
    public ResponseEntity getArticleById(@PathVariable("articleId") String articleIdStr){

        if(!ObjectId.isValid(articleIdStr)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłasciwe id artykułu");
        }

        ObjectId articleId = new ObjectId(articleIdStr);
        ArticleEntity foundArticle;

        try{
            foundArticle = articleService.getArticleById(articleId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        ArticleDTO foundArticleDTO = articleMapper.articleEntityToArticleDTO(
                foundArticle, userRepository, technologyRepository
        );

        return ResponseEntity.ok(foundArticleDTO);
    }

    @GetMapping("/{articleId}/comments/parents")
    public ResponseEntity getParentComments(
        @PathVariable("articleId") String articleIdStr, Pageable pageable
    ){
        if(!ObjectId.isValid(articleIdStr)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłasciwe id artykułu");
        }

        ObjectId articleId = new ObjectId(articleIdStr);

        if(pageable == null){
            pageable = Pageable.unpaged();
        }

        Page<CommentEntity> foundCommentEntityPage = commentService.getSubComments(
            articleId, null, pageable
        );
        Page<CommentDTO> foundCommentDTOPage = foundCommentEntityPage.map(c ->
                commentMapper.commentEntityToCommentDTO(c, userRepository)
        );

        return ResponseEntity.ok(foundCommentDTOPage);
    }

    @PostMapping
    public ResponseEntity addArticle(@RequestBody CreateArticle createArticle){

        ArticleEntity createdArticle;

        try{
            createdArticle = articleService.addArticle(createArticle);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch(EntityConflictException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        ArticleDTO createdArticleDTO = articleMapper.articleEntityToArticleDTO(
                createdArticle, userRepository, technologyRepository
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticleDTO);
    }

    @PutMapping("/{articleId}")
    public ResponseEntity updateArticleById(
            @PathVariable("articleId") String articleIdStr, @RequestBody UpdateArticle updateArticle
    ){
        if(!ObjectId.isValid(articleIdStr)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłasciwe id artykułu");
        }

        ObjectId articleId = new ObjectId(articleIdStr);
        ArticleEntity updatedArticle;

        try{
            updatedArticle = articleService.updateArticle(articleId, updateArticle);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch(EntityConflictException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        ArticleDTO updatedArticleDTO = articleMapper.articleEntityToArticleDTO(
                updatedArticle, userRepository, technologyRepository
        );

        return ResponseEntity.status(HttpStatus.OK).body(updatedArticleDTO);
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity deleteArticleById(@PathVariable("articleId") String articleIdStr){

        if(!ObjectId.isValid(articleIdStr)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłasciwe id artykułu");
        }

        ObjectId articleId = new ObjectId(articleIdStr);

        try{
            articleService.deleteArticleById(articleId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
