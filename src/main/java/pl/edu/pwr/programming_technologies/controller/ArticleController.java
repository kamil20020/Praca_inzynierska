package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.ArticleMapper;
import pl.edu.pwr.programming_technologies.mapper.MongoObjectIDMapper;
import pl.edu.pwr.programming_technologies.model.dto.ArticleDTO;
import pl.edu.pwr.programming_technologies.model.dto.SimpleArticleDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.ArticleService;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping(value = "/article")
public class ArticleController {

    private final ArticleService articleService;
    private final ArticleMapper articleMapper = ArticleMapper.INSTANCE;
    private final MongoObjectIDMapper mongoObjectIDMapper = MongoObjectIDMapper.INSTANCE;
    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;

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

        ObjectId articleId = mongoObjectIDMapper.hexStringToObjectId(articleIdStr);

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

    @PostMapping
    public ResponseEntity<ArticleDTO> addArticle(@RequestBody SimpleArticleDTO simpleArticleDTO){

        ArticleEntity articleEntity = articleMapper.simpleArticleDTOToArticleEntity(simpleArticleDTO);
        ArticleEntity createdArticle = articleService.addArticle(articleEntity);
        ArticleDTO createdArticleDTO = articleMapper.articleEntityToArticleDTO(
                createdArticle, userRepository, technologyRepository
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticleDTO);
    }
}
