package pl.edu.pwr.programming_technologies.exceptions;

public class EntityNotFoundException extends RuntimeException {

    private String message;

    public EntityNotFoundException() {

    }

    public EntityNotFoundException(String message){
        super(message);

        this.message = message;
    }
}
