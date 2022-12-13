package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.ArticleVerificationMapper;
import pl.edu.pwr.programming_technologies.model.dto.ArticleVerificationDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleVerificationService;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping(value = "/article-verification")
public class ArticleVerificationController {

    private final ArticleVerificationService articleVerificationService;
    private final ArticleVerificationMapper articleVerificationMapper = ArticleVerificationMapper.INSTANCE;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;

    @GetMapping("/{articleVerificationId}")
    public ResponseEntity getArticleVerificationById(
        @PathVariable("articleVerificationId") String articleVerificationIdStr
    ) {
        Integer articleVerificationId;

        try{
            articleVerificationId = Integer.valueOf(articleVerificationIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id weryfikacji artykułu");
        }

        ArticleVerificationEntity foundArticleVerificationEntity;

        try{
            foundArticleVerificationEntity = articleVerificationService.getById(articleVerificationId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        ArticleVerificationDTO foundArticleVerificationDTO =
            articleVerificationMapper.articleVerificationEntityToArticleVerificationDTO(
                foundArticleVerificationEntity, articleRepository, userRepository, technologyRepository
            );

        return ResponseEntity.ok(foundArticleVerificationDTO);
    }

    @GetMapping("/to/{reviewerId}")
    public ResponseEntity getArticleVerificationsByReviewerId(
        @PathVariable("reviewerId") String reviewerIdStr, Pageable pageable
    ){
        Integer reviewerId;

        try{
            reviewerId = Integer.valueOf(reviewerIdStr);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        if(pageable == null){
            pageable = Pageable.unpaged();
        }

        Page<ArticleVerificationEntity> foundArticleVerificationsPage;

        try{
            foundArticleVerificationsPage = articleVerificationService.getCreatedArticleVerificationsByReviewerId(
                reviewerId, pageable
            );
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        Page<ArticleVerificationDTO> foundArticleVerificationsDTOPage = foundArticleVerificationsPage
            .map(a -> articleVerificationMapper.articleVerificationEntityToArticleVerificationDTO(
                a, articleRepository, userRepository, technologyRepository
            ));

        return ResponseEntity.ok(foundArticleVerificationsDTOPage);
    }

    @GetMapping("/article/{articleId}")
    public ResponseEntity getByArticleId(@PathVariable(name="articleId") String articleIdStr){

        if(!ObjectId.isValid(articleIdStr)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłasciwe id artykułu");
        }

        ObjectId articleId = new ObjectId(articleIdStr);

        ArticleVerificationEntity foundArticleVerificationEntity;

        try{
            foundArticleVerificationEntity = articleVerificationService.getByArticleId(articleId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        String verificationFeedback;

        if(foundArticleVerificationEntity.getVerificationFeedback() != null){
            verificationFeedback = foundArticleVerificationEntity.getVerificationFeedback();
        }
        else{
            verificationFeedback = "";
        }

        return ResponseEntity.ok(verificationFeedback);
    }

    @PutMapping("/{articleVerificationId}")
    public ResponseEntity changeArticleVerificationStatusById(
        @PathVariable("articleVerificationId") String articleVerificationIdStr,
        @RequestParam(name = "status") String articleVerificationStatusStr,
        String feedback
    ){
        Integer articleVerificationId;

        try{
            articleVerificationId = Integer.valueOf(articleVerificationIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id weryfikacji artykułu");
        }

        ArticleVerificationEntity.Status articleVerificationStatus;

        try{
            articleVerificationStatus = ArticleVerificationEntity.Status.valueOf(articleVerificationStatusStr);
        }
        catch(IllegalArgumentException | NullPointerException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Podano nieprawidłowy status weryfikacji artykułu");
        }

        try{
            articleVerificationService.changeArticleVerificationStatusById(
                    articleVerificationId, articleVerificationStatus, feedback
            );
        }
        catch(EntityNotFoundException e){
            ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
