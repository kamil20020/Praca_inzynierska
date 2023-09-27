package pl.edu.pwr.programming_technologies.controller;

import io.restassured.response.Response;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import pl.edu.pwr.programming_technologies.mapper.TechnologyMapper;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyDTO;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@RequiredArgsConstructor
public class TechnologyControllerTests {

    @Autowired
    private TechnologyCategoryRepository technologyCategoryRepository;

    @Autowired
    private TechnologyRepository technologyRepository;

    TechnologyMapper technologyMapper = TechnologyMapper.INSTANCE;

    private List<TechnologyCategoryEntity> technologyCategories;

    private List<TechnologyEntity> technologies;

    private final String url = "http://localhost:9000/technology/";

    @BeforeAll
    public void initAll(){

        initTechnologyCategories();
        initTechnologies();
    }

    public void initTechnologyCategories(){

        TechnologyCategoryEntity tc1 = TechnologyCategoryEntity.builder()
                .name("1")
                .build();

        TechnologyCategoryEntity tc2 = TechnologyCategoryEntity.builder()
                .name("2")
                .build();

        TechnologyCategoryEntity tc3 = TechnologyCategoryEntity.builder()
                .name("3")
                .build();

        technologyCategories = technologyCategoryRepository.saveAll(
                List.of(tc1, tc2, tc3)
        );
    }

    public void initTechnologies(){

        technologies = new ArrayList<>();

        for(int i=0; i < 10; i++){

            String str = String.valueOf(i);

            TechnologyEntity t = TechnologyEntity.builder()
                .name("t" + str)
                .description("d" + str)
                .creationDateTime(LocalDateTime.now())
                .modificationDateTime(LocalDateTime.now())
                .technologyCategoryEntity(technologyCategories.get(i % 3))
                .build();

            technologies.add(t);

            technologies = technologyRepository.saveAll(technologies);
        }
    }

    @Test
    public void shouldGetAll(){

        List<Integer> technologiesIds = technologies.stream()
            .map(technologyEntity -> technologyEntity.getId())
            .collect(Collectors.toList());

        Response response = given()
                .when()
                .get(url);

        response.then().statusCode(HttpStatus.OK.value());
        TechnologyDTO[] gotTechnologies = response.as(TechnologyDTO[].class);

        for(int i=0; i < gotTechnologies.length; i++){
            assertTrue(technologiesIds.contains(gotTechnologies[i].getId()));
        }
    }

    @Test
    public void shouldGetAllByTechnologyCategoryId(){

        Integer technologyCategoryId = 1;

        long numberOfTechnologiesWithTechnologyCategory = technologies.stream()
                .filter(technologyEntity -> technologyEntity.getTechnologyCategoryEntity().getId() == technologyCategoryId)
                .count();

        Response response = given()
                .when()
                .get(url + "category/" + technologyCategoryId);

        response.then().statusCode(HttpStatus.OK.value());

        TechnologyDTO[] gotTechnologies = response.as(TechnologyDTO[].class);

        assertEquals(gotTechnologies.length, numberOfTechnologiesWithTechnologyCategory);
    }

    @Test
    public void shouldNotGetAllByInvalidTechnologyCategoryId(){

        Response response = given()
                .when()
                .get(url + "category/a");

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldNotGetAllByNotExistingTechnologyCategoryId(){

        Response response = given()
                .when()
                .get(url + "category/20");

        response.then().statusCode(HttpStatus.NOT_FOUND.value());
    }
}
