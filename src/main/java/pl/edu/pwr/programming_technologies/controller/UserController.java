package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.UserMapper;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping(value = "/user")
public class UserController {

    @Value("${frontend.url}")
    private String frontendURL;

    private final UserService userService;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    @GetMapping("/user-account-id/{userAccountId}")
    ResponseEntity getUserByUserAccountId(@PathVariable("userAccountId") String userAccountId){

        UserEntity foundUser;

        try{
            foundUser = userService.getUserByUserAccountId(userAccountId);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        UserDTO userDTO = userMapper.userEntityToUserDTO(foundUser);

        return ResponseEntity.ok(userDTO);
    }
    
    @GetMapping("/nickname/{nickname}")
    ResponseEntity existsUserByNickname(@PathVariable("nickname") String nickname){

        try{
            boolean result = userService.existsUserByNickname(nickname);
            return ResponseEntity.ok(result);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping
    ResponseEntity createUser(@RequestBody UserDTO userDTO){

        UserEntity userEntity = userMapper.userDTOToUserEntity(userDTO);
        UserEntity createdUserEntity;

        try{
            createdUserEntity = userService.createUser(userEntity);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityConflictException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        UserDTO createdUserDTO = userMapper.userEntityToUserDTO(createdUserEntity);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDTO);
    }
}
