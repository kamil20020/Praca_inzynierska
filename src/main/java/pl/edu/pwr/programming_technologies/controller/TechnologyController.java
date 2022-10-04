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
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping(value = "/technology")
public class TechnologyController {

    private final TechnologyService technologyService;
    private final TechnologyMapper technologyMapper = TechnologyMapper.INSTANCE;

}
