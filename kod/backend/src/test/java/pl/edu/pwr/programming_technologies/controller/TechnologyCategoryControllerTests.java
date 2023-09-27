package pl.edu.pwr.programming_technologies.controller;

import io.restassured.response.Response;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import pl.edu.pwr.programming_technologies.mapper.TechnologyCategoryMapper;
import pl.edu.pwr.programming_technologies.model.dto.ComplexTechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;

import java.util.Arrays;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@RequiredArgsConstructor
public class TechnologyCategoryControllerTests {

    @Autowired
    private TechnologyCategoryRepository technologyCategoryRepository;

    private final TechnologyCategoryMapper technologyCategoryMapper = TechnologyCategoryMapper.INSTANCE;

    private List<TechnologyCategoryEntity> technologyCategories;

    private final String url = "http://localhost:9000/technology-category/";

    @BeforeAll
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

        TechnologyCategoryEntity tc11 = TechnologyCategoryEntity.builder()
                .name("11")
                .parentTechnologyCategoryEntity(tc1)
                .build();

        TechnologyCategoryEntity tc21 = TechnologyCategoryEntity.builder()
                .name("21")
                .parentTechnologyCategoryEntity(tc2)
                .build();

        TechnologyCategoryEntity tc22 = TechnologyCategoryEntity.builder()
                .name("22")
                .parentTechnologyCategoryEntity(tc2)
                .build();

        TechnologyCategoryEntity tc31 = TechnologyCategoryEntity.builder()
                .name("31")
                .parentTechnologyCategoryEntity(tc3)
                .build();

        TechnologyCategoryEntity tc111 = TechnologyCategoryEntity.builder()
                .name("111")
                .parentTechnologyCategoryEntity(tc11)
                .build();

        TechnologyCategoryEntity tc112 = TechnologyCategoryEntity.builder()
                .name("112")
                .parentTechnologyCategoryEntity(tc11)
                .build();

        TechnologyCategoryEntity tc113 = TechnologyCategoryEntity.builder()
                .name("113")
                .parentTechnologyCategoryEntity(tc11)
                .build();

        TechnologyCategoryEntity tc121 = TechnologyCategoryEntity.builder()
                .name("121")
                .parentTechnologyCategoryEntity(tc21)
                .build();

        TechnologyCategoryEntity tc122 = TechnologyCategoryEntity.builder()
                .name("122")
                .parentTechnologyCategoryEntity(tc21)
                .build();

        technologyCategories = technologyCategoryRepository.saveAll(
                List.of(tc1, tc2, tc3, tc11, tc21, tc22, tc31, tc111, tc112, tc113, tc121, tc122)
        );
    }

    @Test
    public void shouldGetTreeOfTechnologyCategories(){

        Response response = given()
                .when()
                .get(url + "tree");

        response.then().statusCode(HttpStatus.OK.value());

        List<ComplexTechnologyCategoryDTO> foundComplexTechnologyCategoryDTOs = Arrays.stream(
                response.as(ComplexTechnologyCategoryDTO[].class)
        ).toList();
        List<TechnologyCategoryEntity> foundTechnologyCategories =
            technologyCategoryMapper.complexTechnologyCategoryDTOListToTechnologyCategoryEntityList(
                    foundComplexTechnologyCategoryDTOs
            );

        assertEquals(foundTechnologyCategories.get(0).getId(), technologyCategories.get(0).getId());
        assertEquals(foundTechnologyCategories.get(1).getId(), technologyCategories.get(1).getId());
        assertEquals(foundTechnologyCategories.get(2).getId(), technologyCategories.get(2).getId());

        List<TechnologyCategoryEntity> childrenTechnologyCategories1 =
                foundTechnologyCategories.get(0).getChildrenTechnologyCategoryEntityList();

        assertEquals(childrenTechnologyCategories1.get(0).getId(), technologyCategories.get(3).getId());

        List<TechnologyCategoryEntity> childrenTechnologyCategories2 =
                foundTechnologyCategories.get(1).getChildrenTechnologyCategoryEntityList();

        assertEquals(childrenTechnologyCategories2.get(0).getId(), technologyCategories.get(4).getId());
        assertEquals(childrenTechnologyCategories2.get(1).getId(), technologyCategories.get(5).getId());

        List<TechnologyCategoryEntity> childrenTechnologyCategories3 =
                foundTechnologyCategories.get(2).getChildrenTechnologyCategoryEntityList();

        assertEquals(childrenTechnologyCategories3.get(0).getId(), technologyCategories.get(6).getId());

        List<TechnologyCategoryEntity> childrenTechnologyCategories11 =
                childrenTechnologyCategories1.get(0).getChildrenTechnologyCategoryEntityList();

        assertEquals(childrenTechnologyCategories11.get(0).getId(), technologyCategories.get(7).getId());
        assertEquals(childrenTechnologyCategories11.get(1).getId(), technologyCategories.get(8).getId());
        assertEquals(childrenTechnologyCategories11.get(2).getId(), technologyCategories.get(9).getId());

        List<TechnologyCategoryEntity> childrenTechnologyCategories21 =
                childrenTechnologyCategories2.get(0).getChildrenTechnologyCategoryEntityList();

        assertEquals(childrenTechnologyCategories21.get(0).getId(), technologyCategories.get(10).getId());
        assertEquals(childrenTechnologyCategories21.get(1).getId(), technologyCategories.get(11).getId());
    }

    @Test
    public void shouldGetTechnologyCategoryById(){

        Response response = given()
                .when()
                .get(url + "2");

        response.then().statusCode(HttpStatus.OK.value());

        TechnologyCategoryDTO technologyCategoryDTO = response.as(TechnologyCategoryDTO.class);

        assertEquals(technologyCategoryDTO.getId(), technologyCategories.get(1).getId());
    }

    @Test
    public void shouldNotGetTechnologyCategoryByInvalidId(){

        Response response = given()
                .when()
                .get(url + "a");

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldNotGetTechnologyCategoryByNotExistingId(){

        Response response = given()
                .when()
                .get(url + "13");

        response.then().statusCode(HttpStatus.NOT_FOUND.value());
    }
}
