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
import pl.edu.pwr.programming_technologies.mapper.TechnologyExpertMapper;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyExpertDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyExpertEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyExpertRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@RequiredArgsConstructor
public class TechnologyExpertControllerTests {

    @Autowired
    private TechnologyExpertRepository technologyExpertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TechnologyCategoryRepository technologyCategoryRepository;

    @Autowired
    private TechnologyRepository technologyRepository;

    private final TechnologyExpertMapper technologyExpertMapper = TechnologyExpertMapper.INSTANCE;

    private List<TechnologyExpertEntity> technologyExpertEntityList;
    private List<UserEntity> userEntityList;
    private List<TechnologyCategoryEntity> technologyCategoryEntityList;
    private List<TechnologyEntity> technologyEntityList;

    private final String url = "http://localhost:9000/technology-expert/";

    @BeforeAll
    public void initData(){

        userEntityList = new ArrayList<>();

        for (int i = 0; i < 10; i++) {

            String str = String.valueOf(i);

            UserEntity user = UserEntity.builder()
                    .userAccountId(str)
                    .nickname(str)
                    .firstname(str)
                    .surname(str)
                    .email(str + "@mail.pl")
                    .build();

            userEntityList.add(user);
        }

        userEntityList = userRepository.saveAll(userEntityList);

        technologyCategoryEntityList = new ArrayList<>();

        for (int i = 0; i < 4; i++){

            TechnologyCategoryEntity technologyCategory = TechnologyCategoryEntity.builder()
                    .name(String.valueOf(i))
                    .build();

            technologyCategoryEntityList.add(technologyCategory);

            int parentIndex = technologyCategoryEntityList.size() - 1;

            for (int j = 0; j < 4; j++){

                TechnologyCategoryEntity subTechnologyCategory = TechnologyCategoryEntity.builder()
                        .name(i + String.valueOf(j))
                        .parentTechnologyCategoryEntity(technologyCategoryEntityList.get(parentIndex))
                        .build();

                technologyCategoryEntityList.add(subTechnologyCategory);
            }
        }

        technologyCategoryEntityList = technologyCategoryRepository.saveAll(technologyCategoryEntityList);

        technologyEntityList = new ArrayList<>();

        for (int i = 0; i < 8; i++){

            TechnologyEntity technology = TechnologyEntity.builder()
                    .technologyCategoryEntity(technologyCategoryEntityList.get(i))
                    .name(String.valueOf(i))
                    .description(String.valueOf(i))
                    .creationDateTime(LocalDateTime.now())
                    .modificationDateTime(LocalDateTime.now())
                    .build();

            technologyEntityList.add(technology);
        }

        technologyEntityList = technologyRepository.saveAll(technologyEntityList);

        technologyExpertEntityList = new ArrayList<>();

        for (int i = 0; i < 6; i++){

            TechnologyExpertEntity technologyExpert = TechnologyExpertEntity.builder()
                    .technologyEntity(technologyEntityList.get(i))
                    .userEntity(userEntityList.get(i))
                    .build();

            TechnologyExpertEntity technologyExpert1 = TechnologyExpertEntity.builder()
                    .technologyEntity(technologyEntityList.get(i+1))
                    .userEntity(userEntityList.get(i))
                    .build();

            technologyExpertEntityList.addAll(List.of(technologyExpert, technologyExpert1));
        }

        technologyExpertRepository.saveAll(technologyExpertEntityList);
    }

    @Test
    public void shouldGetAllByUserIdAndContainingTechnologyName(){

        Integer userId = userEntityList.get(0).getId();
        String technologyName = technologyEntityList.get(0).getName();

        Response response = given()
                .when()
                .param("technology_name", technologyName)
                .get(url + "/user/" + userId);

        response.then().statusCode(HttpStatus.OK.value());

        List<TechnologyExpertDTO> foundTechnologyExpertDTOList = Arrays.stream(response.as(TechnologyExpertDTO[].class))
                .collect(Collectors.toList());

        List<TechnologyExpertEntity> foundTechnologyExpertEntityList =
                technologyExpertMapper.technologyExpertDTOListToTechnologyExpertEntityList(foundTechnologyExpertDTOList);

        assertEquals(foundTechnologyExpertEntityList.get(0).getId(), technologyEntityList.get(0).getId());
        assertEquals(foundTechnologyExpertEntityList.get(1).getId(), technologyEntityList.get(1).getId());
    }
}
