package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.TechnologyExpertMapper;
import pl.edu.pwr.programming_technologies.mapper.TechnologyMapper;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyDTO;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyExpertDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyExpertEntity;
import pl.edu.pwr.programming_technologies.service.TechnologyExpertService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping(value = "/technology-expert")
public class TechnologyExpertController {

    private final TechnologyExpertService technologyExpertService;
    private final TechnologyMapper technologyMapper = TechnologyMapper.INSTANCE;
    private final TechnologyExpertMapper technologyExpertMapper = TechnologyExpertMapper.INSTANCE;

    @GetMapping("/user/{userId}")
    ResponseEntity getAllByUserIdAndContainingTechnologyName(
            @PathVariable("userId") String userIdStr,
            @RequestParam("technology_name") String technologyName
    ){

        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
        }

        List<TechnologyExpertEntity> foundTechnologyExpertEntityList;

        try{
            foundTechnologyExpertEntityList = technologyExpertService.getTechnologyExpertEntityListByUserIdAndTechnologyName(
                    userId, technologyName
            );
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        List<TechnologyExpertDTO> foundTechnologyExpertDTOList =
            technologyExpertMapper.technologyExpertEntityListToTechnologyExpertDTOList(foundTechnologyExpertEntityList);

        return ResponseEntity.ok(foundTechnologyExpertDTOList);
    }

    @GetMapping("/user/{userId}/assignable-technologies")
    ResponseEntity getTechnologiesWhichUserDoesNotHave(@PathVariable("userId") String userIdStr){

        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
        }

        List<TechnologyEntity> foundTechnologyEntityList;

        try{
            foundTechnologyEntityList = technologyExpertService.getTechnologiesWhichUserDoesNotHave(userId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        List<TechnologyDTO> foundTechnologyDTOList = technologyMapper.technologyEntityListToTechnologyDTOList(
                foundTechnologyEntityList
        );

        return ResponseEntity.ok(foundTechnologyDTOList);
    }

    @GetMapping("/user/{userId}/assignable-technologies/technology-category/{technologyCategoryId}")
    ResponseEntity getTechnologiesByTechnologyCategoryIdWhichUserDoesNotHave(
            @PathVariable("userId") String userIdStr,
            @PathVariable("technologyCategoryId") String technologyCategoryIdStr
    ){
        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
        }

        Integer technologyCategoryId;

        try{
            technologyCategoryId = Integer.valueOf(technologyCategoryIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id technologii");
        }

        List<TechnologyEntity> foundTechnologyEntityList;

        try{
            foundTechnologyEntityList = technologyExpertService.getTechnologiesByTechnologyCategoryIdWhichUserDoesNotHave(
                    userId, technologyCategoryId
            );
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        List<TechnologyDTO> foundTechnologyDTOList = technologyMapper.technologyEntityListToTechnologyDTOList(
                foundTechnologyEntityList
        );

        return ResponseEntity.ok(foundTechnologyDTOList);
    }

    @PostMapping("/user/{userId}")
    ResponseEntity createTechnologyExpert(
            @PathVariable("userId") String userIdStr, @RequestBody String technologyIdStr
    ){

        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
        }

        Integer technologyId;

        try{
            technologyId = Integer.valueOf(technologyIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id technologii");
        }

        TechnologyExpertEntity createdTechnologyExpertEntity;

        try{
            createdTechnologyExpertEntity = technologyExpertService.createTechnologyExpert(userId, technologyId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch(EntityConflictException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        TechnologyExpertDTO createdTechnologyExpertDTO =
                technologyExpertMapper.technologyExpertEntityToTechnologyExpertDTO(createdTechnologyExpertEntity);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTechnologyExpertDTO);
    }

    @DeleteMapping("/{technologyExpertId}")
    ResponseEntity deleteById(@PathVariable("technologyExpertId") String technologyExpertIdStr){

        Integer technologyExpertId;

        try{
            technologyExpertId = Integer.valueOf(technologyExpertIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Podano nieprawidłowe id przypisania technologii");
        }

        try{
            technologyExpertService.deleteTechnologyExpertById(technologyExpertId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.noContent().build();
    }
}
