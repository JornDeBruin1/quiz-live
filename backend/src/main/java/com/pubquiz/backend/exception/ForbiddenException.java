package com.pubquiz.backend.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException() {
        super("Je hebt geen toegang tot dit onderdeel");
    }
}