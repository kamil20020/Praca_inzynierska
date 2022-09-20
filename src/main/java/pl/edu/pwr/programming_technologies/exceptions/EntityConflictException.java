package pl.edu.pwr.programming_technologies.exceptions;

public class EntityConflictException extends RuntimeException{

    private String message;

    public EntityConflictException() {

    }

    public EntityConflictException(String message){
        super(message);

        this.message = message;
    }
}
