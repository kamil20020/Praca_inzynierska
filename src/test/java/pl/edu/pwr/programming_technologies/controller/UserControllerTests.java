package pl.edu.pwr.programming_technologies.controller;

import io.restassured.response.Response;
import lombok.RequiredArgsConstructor;
import org.apache.http.entity.ContentType;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import pl.edu.pwr.programming_technologies.mapper.UserMapper;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@RequiredArgsConstructor
public class UserControllerTests {

    @Autowired
    private UserRepository userRepository;

    private final UserMapper userMapper = UserMapper.INSTANCE;

    private List<UserEntity> users;

    private String url = "http://localhost:9000/user/";

    @BeforeAll
    public void initUsers() {

        users = new ArrayList<>();

        for (int i = 0; i < 10; i++) {

            String str = String.valueOf(i);

            UserEntity user = UserEntity.builder()
                    .userAccountId(str)
                    .nickname(str)
                    .firstname(str)
                    .surname(str)
                    .email(str + "@mail.pl")
                    .build();

            users.add(user);
        }

        users = userRepository.saveAll(users);
    }

    @Test
    public void shouldGetUserByUserAccountId() {

        UserEntity user = users.get(1);

        Response response = given()
                .when()
                .get(url + "user-account-id/" + user.getUserAccountId());

        response.then().statusCode(HttpStatus.OK.value());

        UserDTO userDTO = response.as(UserDTO.class);
        UserEntity userEntity = userMapper.userDTOToUserEntity(userDTO);

        assertTrue(userEntity.getUserAccountId().equals(user.getUserAccountId()));
    }

    @Test
    public void shouldntGetUserByNotExistingUserAccountId() {

        Response response = given()
                .when()
                .get(url + "user-account-id/-1");

        response.then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void shouldReturnTrueWhenUserExistsByNickname() {

        Response response = given()
                .when()
                .get(url + "nickname/" + users.get(1).getNickname());

        response.then().statusCode(HttpStatus.OK.value());

        boolean result = response.as(boolean.class);

        assertEquals(result, true);
    }

    @Test
    public void shouldReturnFalseWhenUserDoesntExistByNickname() {

        Response response = given()
                .when()
                .get(url + "nickname/" + "a");

        response.then().statusCode(HttpStatus.OK.value());

        boolean result = response.as(boolean.class);

        assertEquals(result, false);
    }

    @Test
    public void shouldCreateUser(){

        UserEntity userEntity = UserEntity.builder()
            .userAccountId("10")
            .nickname("10")
            .firstname("10")
            .surname("10")
            .email("10@mail.pl")
            .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .post(url);

        response.then().statusCode(HttpStatus.CREATED.value());

        UserDTO createdUserDTO = response.as(UserDTO.class);
        UserEntity createdUserEntity = userMapper.userDTOToUserEntity(createdUserDTO);

        assertEquals(createdUserEntity.getUserAccountId(), userEntity.getUserAccountId());

        userRepository.deleteById(createdUserEntity.getId());
    }

    @Test
    public void shouldntCreateUserWithConflictUserAccountId(){

        UserEntity userEntity = UserEntity.builder()
                .userAccountId("1")
                .nickname("10")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .post(url);

        response.then().statusCode(HttpStatus.CONFLICT.value());
    }

    @Test
    public void shouldntCreateUserWithConflictNickname(){

        UserEntity userEntity = UserEntity.builder()
                .userAccountId("10")
                .nickname("1")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .post(url);

        response.then().statusCode(HttpStatus.CONFLICT.value());
    }

    @Test
    public void shouldntCreateUserWithEmptyData(){

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .post(url);

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldntCreateUserWithNotGivenUserAccountId(){

        UserEntity userEntity = UserEntity.builder()
                .nickname("10")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .body(userDTO)
                .contentType(ContentType.APPLICATION_JSON.toString())
                .post(url);

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldntCreateUserWithNotGivenNickname(){

        UserEntity userEntity = UserEntity.builder()
                .userAccountId("10")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .post(url);

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldUpdateUser(){

        UserEntity userEntity = UserEntity.builder()
                .nickname("11")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .put(url + users.get(0).getId());

        response.then().statusCode(HttpStatus.OK.value());

        UserDTO updatedUserDTO = response.as(UserDTO.class);
        UserEntity updatedUserEntity = userMapper.userDTOToUserEntity(updatedUserDTO);

        assertEquals(updatedUserEntity.getId(), users.get(0).getId());
        assertEquals(updatedUserEntity.getNickname(), userEntity.getNickname());
        assertEquals(updatedUserEntity.getFirstname(), userEntity.getFirstname());
        assertEquals(updatedUserEntity.getSurname(), userEntity.getFirstname());
        assertEquals(updatedUserEntity.getEmail(), userEntity.getEmail());
    }

    @Test
    public void shouldntUpdateUserWithInvalidId(){

        UserEntity userEntity = UserEntity.builder()
                .nickname("10")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .put(url + "a");

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldntUpdateUserWithEmptyData(){

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .put(url + users.get(0).getId());

        response.then().statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    public void shouldntUpdateUserWhenIdDoesntExist(){

        UserEntity userEntity = UserEntity.builder()
                .nickname("10")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .put(url + "11");

        response.then().statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    public void shouldntUpdateUserWithConflictNickname(){

        UserEntity userEntity = UserEntity.builder()
                .nickname("1")
                .firstname("10")
                .surname("10")
                .email("10@mail.pl")
                .build();

        UserDTO userDTO = userMapper.userEntityToUserDTO(userEntity);

        Response response = given()
                .when()
                .contentType(ContentType.APPLICATION_JSON.toString())
                .body(userDTO)
                .put(url + users.get(0).getId());

        response.then().statusCode(HttpStatus.CONFLICT.value());
    }
}
