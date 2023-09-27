package pl.edu.pwr.programming_technologies.controller;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.api.request.CreateAcceptation;
import pl.edu.pwr.programming_technologies.service.OpinionAcceptationService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://technologie-programistyczne.azurewebsites.net"})
@RequiredArgsConstructor
@RequestMapping(value = "/acceptance")
public class OpinionAcceptationController {

    private final OpinionAcceptationService opinionAcceptationService;


    @PostMapping
    public ResponseEntity createAcceptation(@RequestBody CreateAcceptation createAcceptation){

        if(createAcceptation == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nie podano danych");
        }

        ObjectId opinionId;

        try{
            opinionId = new ObjectId(createAcceptation.getOpinionId());
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id opinii");
        }

        try{
            opinionAcceptationService.createAcceptance(
                opinionId, createAcceptation.getUserId(), createAcceptation.getValue()
            );
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity deleteAcceptation(
        @RequestParam(name="opinionId") String opinionIdStr, @RequestParam(name="userId") String userIdStr)
    {
        ObjectId opinionId;

        try{
            opinionId = new ObjectId(opinionIdStr);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano niewłaściwe id opinii");
        }

        Integer userId;

        try{
            userId = Integer.valueOf(userIdStr);
        }
        catch(NumberFormatException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Podano nieprawidłowe id użytkownika");
        }

        try{
            opinionAcceptationService.deleteAcceptanceByOpinionIdAndUserId(opinionId, userId);
        }
        catch(EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
