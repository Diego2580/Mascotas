package com.salamea.mascotas.exception;

public class MascotaNotFoundException extends RuntimeException {
    public MascotaNotFoundException(String message) {
        super(message);
    }
    
    public MascotaNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
