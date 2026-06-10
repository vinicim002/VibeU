package com.vibeU.backend.exception;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(message, org.springframework.http.HttpStatus.NOT_FOUND);
    }
}
