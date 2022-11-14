package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.mapper.DateTimeMapper;
import pl.edu.pwr.programming_technologies.mapper.UserInaccessibilityMapper;
import pl.edu.pwr.programming_technologies.model.api.request.CreateUserInaccessibility;
import pl.edu.pwr.programming_technologies.model.dto.UserInaccessibilityDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserInaccessibilityEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.UserInaccessibilityService;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://technologie-programistyczne.netlify.app"})
@RequiredArgsConstructor
@RequestMapping("/user-inaccessibility")
public class UserInaccessibilityController {

    private final UserInaccessibilityService userInaccessibilityService;
    private final UserInaccessibilityMapper userInaccessibilityMapper = UserInaccessibilityMapper.INSTANCE;
    private final DateTimeMapper dateTimeMapper = DateTimeMapper.INSTANCE;
    private final UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity getUserInaccessibilityDateByUserId(@PathVariable("userId") String userIdStr){

        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id użytkownika");
        }

        Optional<UserInaccessibilityEntity> userInaccessibilityEntity;

        try{
            userInaccessibilityEntity = Optional.ofNullable(
                userInaccessibilityService.getUserInaccessibilityByUserId(userId)
            );
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        if(userInaccessibilityEntity.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        UserInaccessibilityDTO userInaccessibilityDTO =
            userInaccessibilityMapper.userInaccessibilityEntityToUserInaccessibilityDTO(
                userInaccessibilityEntity.get()
            );

        return ResponseEntity.ok(userInaccessibilityDTO);
    }

    @PostMapping
    public ResponseEntity createUserInaccessibilityByUserId(
        @RequestBody CreateUserInaccessibility createUserInaccessibility
    ) {
        if(createUserInaccessibility == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nie podano danych");
        }

        if(createUserInaccessibility.getUserId() == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nie podano id użytkownika");
        }

        UserInaccessibilityEntity createdUserInaccessibilityEntity;

        try{
            createdUserInaccessibilityEntity = userInaccessibilityService.createUserInaccessibility(
                createUserInaccessibility.getUserId(),
                dateTimeMapper.offsetDateTimeToLocalDateTime(createUserInaccessibility.getToDate())
            );
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch(EntityConflictException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        UserInaccessibilityDTO createdUserInaccessibilityDTO =
            userInaccessibilityMapper.userInaccessibilityEntityToUserInaccessibilityDTO(
                    createdUserInaccessibilityEntity
            );

        return ResponseEntity.status(HttpStatus.OK).body(createdUserInaccessibilityDTO);
    }

    @DeleteMapping("/{userInaccessibilityId}")
    public ResponseEntity deleteUserInaccessibilityById(
        @PathVariable("userInaccessibilityId") String userInaccessibilityIdStr
    ){
        Integer userInaccessibilityId;

        try{
            userInaccessibilityId = Integer.valueOf(userInaccessibilityIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id użytkownika");
        }

        try {
            userInaccessibilityService.deleteUserInaccessibilityById(userInaccessibilityId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
