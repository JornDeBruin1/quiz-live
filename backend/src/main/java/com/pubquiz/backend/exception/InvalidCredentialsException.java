package com.pubquiz.backend.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Onjuiste gebruikersnaam of wachtwoord");
    }
}
