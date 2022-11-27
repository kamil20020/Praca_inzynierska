package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.TechnologyMapper;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.service.TechnologyService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping(value = "/technology")
public class TechnologyController {

    private final TechnologyService technologyService;
    private final TechnologyMapper technologyMapper = TechnologyMapper.INSTANCE;

    @GetMapping
    public ResponseEntity<List<TechnologyDTO>> getAll(){

        List<TechnologyEntity> technologyEntityList = technologyService.getAll();
        List<TechnologyDTO> technologyDTOList = technologyMapper.technologyEntityListToTechnologyDTOList(
                technologyEntityList
        );

        return ResponseEntity.ok(technologyDTOList);
    }

    @GetMapping("/category/{technologyCategoryId}")
    public ResponseEntity getAllByTechnologyCategoryId(
            @PathVariable("technologyCategoryId") String technologyCategoryIdStr
    ){
        Integer technologyCategoryId;

        try{
            technologyCategoryId = Integer.valueOf(technologyCategoryIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id kategorii technologii");
        }

        List<TechnologyEntity> technologyEntityList;

        try{
            technologyEntityList = technologyService.getAllByTechnologyCategoryId(technologyCategoryId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        List<TechnologyDTO> technologyDTOList = technologyMapper.technologyEntityListToTechnologyDTOList(
                technologyEntityList
        );

        return ResponseEntity.ok(technologyDTOList);
    }
}
