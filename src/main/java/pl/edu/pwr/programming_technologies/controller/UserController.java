package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.UserMapper;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.primary.UserEntity;
import pl.edu.pwr.programming_technologies.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper = UserMapper.INSTANCE;

    @GetMapping("/user-account-id/{userAccountId}")
    ResponseEntity getUserByUserAccountId(@PathVariable("userAccountId") String userAccountId){

        UserEntity foundUser;

        try{
            foundUser = userService.getUserByUserAccountId(userAccountId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        UserDTO userDTO = userMapper.userEntityToUserDTO(foundUser);

        return ResponseEntity.ok(userDTO);
    }
    
    @GetMapping("/nickname/{nickname}")
    ResponseEntity existsUserByNickname(@PathVariable("nickname") String nickname){

        boolean result = userService.existsUserByNickname(nickname);

        return ResponseEntity.ok(result);
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

    @PutMapping("/{userId}")
    ResponseEntity updateUser(@PathVariable("userId") String userIdStr, @RequestBody UserDTO userDTO){

        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
        }

        UserEntity userEntity = userMapper.userDTOToUserEntity(userDTO);
        UserEntity changedUserEntity;

        try{
            changedUserEntity = userService.updateUser(userId, userEntity);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch(EntityConflictException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        UserDTO changedUserDTO = userMapper.userEntityToUserDTO(changedUserEntity);

        return ResponseEntity.ok(changedUserDTO);
    }
}
