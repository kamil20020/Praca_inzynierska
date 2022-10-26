package pl.edu.pwr.programming_technologies.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.TechnologyCategoryMapper;
import pl.edu.pwr.programming_technologies.model.dto.ComplexTechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.service.TechnologyCategoryService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping(value = "/technology-category")
public class TechnologyCategoryController {

    private final TechnologyCategoryService technologyCategoryService;
    private final TechnologyCategoryMapper technologyCategoryMapper = TechnologyCategoryMapper.INSTANCE;

    @GetMapping("/tree")
    public ResponseEntity<List<ComplexTechnologyCategoryDTO>> getTreeOfTechnologyCategories(){

        List<TechnologyCategoryEntity> technologyCategoryEntityList =
                technologyCategoryService.getTreeOfTechnologyCategories();

        return ResponseEntity.ok(
            technologyCategoryMapper.technologyCategoryEntityListToComplexTechnologyCategoryDTOList(
                technologyCategoryEntityList
            )
        );
    }

    @GetMapping("/{technologyCategoryId}")
    public ResponseEntity getTechnologyCategoryById(@PathVariable("technologyCategoryId") String technologyCategoryIdStr){

        Integer technologyCategoryId;

        try{
            technologyCategoryId = Integer.valueOf(technologyCategoryIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id kategorii technologii");
        }

        TechnologyCategoryEntity foundTechnologyCategoryEntity;

        try{
            foundTechnologyCategoryEntity = technologyCategoryService.getTechnologyCategoryById(technologyCategoryId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        TechnologyCategoryDTO foundTechnologyCategoryDTO =
                technologyCategoryMapper.technologyCategoryEntityToTechnologyCategoryDTO(foundTechnologyCategoryEntity);

        return ResponseEntity.ok(foundTechnologyCategoryDTO);
    }
}
