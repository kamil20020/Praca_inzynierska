package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.OpinionMapper;
import pl.edu.pwr.programming_technologies.model.api.request.CreateOpinion;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateOpinion;
import pl.edu.pwr.programming_technologies.model.dto.OpinionDTO;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.OpinionService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping(value = "/")
public class OpinionController {

    private final OpinionService opinionService;
    private final OpinionMapper opinionMapper = OpinionMapper.INSTANCE;
    private final UserRepository userRepository;

    @GetMapping(value = "/opinion/author/{authorId}")
    public ResponseEntity existsByAuthorId(@PathVariable("authorId") String authorIdStr){

        Integer authorId;

        try{
            authorId = Integer.valueOf(authorIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id autora");
        }

        boolean result = opinionService.existsByUserId(authorId);

        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping(value = "/opinions/article/{articleId}")
    public ResponseEntity getAllByArticleId(
        @PathVariable("articleId") String articleIdStr,
        @RequestParam(name = "userId", required = false) String userIdStr
    ){
        ObjectId articleId;

        try{
            articleId = new ObjectId(articleIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id artykułu");
        }

        Integer userId = null;

        if(userIdStr != null){

            try{
                userId = Integer.valueOf(userIdStr);
            }
            catch(NumberFormatException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
            }
        }

        List<OpinionEntity> foundOpinions;

        try{
            foundOpinions = opinionService.getByArticleId(articleId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        List<OpinionDTO> foundOpinionDTOs = opinionMapper.opinionEntityListToOpinionListDTO(
            foundOpinions, userRepository
        );

        if(userId != null){
            Integer finalUserId = userId;
            foundOpinionDTOs.stream().forEach(opinionDTO ->  {
                opinionDTO.setLoggedUserAcceptance(
                    opinionService.getUserAcceptance(new ObjectId(opinionDTO.getId()), finalUserId)
                );
            });
        }

        return ResponseEntity.ok(foundOpinionDTOs);
    }

    @PostMapping(value = "/opinion")
    public ResponseEntity createOpinion(@RequestBody CreateOpinion createOpinion){

        if(createOpinion == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nie podano danych o opinii");
        }

        ObjectId articleId;

        try{
            articleId = new ObjectId(createOpinion.getArticleId());
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id artykułu");
        }

        OpinionEntity createdOpinion;

        try{
            createdOpinion = opinionService.createOpinion(
                OpinionEntity.builder()
                    .authorId(createOpinion.getAuthorId())
                    .articleId(articleId)
                    .rating(createOpinion.getRating())
                    .content(createOpinion.getContent())
                .build()
            );
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

        OpinionDTO createdOpinionDTO = opinionMapper.opinionEntityToOpinionDTO(createdOpinion, userRepository);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdOpinionDTO);
    }

    @PutMapping(value = "/opinion/{opinionId}")
    public ResponseEntity updateOpinionById(
        @PathVariable("opinionId") String opinionIdStr, @RequestBody UpdateOpinion updateOpinion
    ){
        ObjectId opinionId;

        try{
            opinionId = new ObjectId(opinionIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id opinii");
        }

        OpinionEntity updatedOpinionEntity;

        try{
            updatedOpinionEntity = opinionService.updateOpinionById(opinionId, updateOpinion);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        OpinionDTO updatedOpinionDTO = opinionMapper.opinionEntityToOpinionDTO(updatedOpinionEntity, userRepository);

        return ResponseEntity.ok(updatedOpinionDTO);
    }

    @DeleteMapping(value = "/opinion/{opinionId}")
    public ResponseEntity deleteById(@PathVariable("opinionId") String opinionIdStr){

        ObjectId opinionId;

        try{
            opinionId = new ObjectId(opinionIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id opinii");
        }

        try{
            opinionService.deleteById(opinionId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
