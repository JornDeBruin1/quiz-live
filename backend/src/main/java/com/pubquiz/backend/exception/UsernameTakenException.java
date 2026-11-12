package com.pubquiz.backend.exception;

public class UsernameTakenException extends RuntimeException {
    public UsernameTakenException() {
        super("Gebruikersnaam is al in gebruik");
    }
}
