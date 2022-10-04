package pl.edu.pwr.programming_technologies.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
