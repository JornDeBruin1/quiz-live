package com.pubquiz.backend.exception;

public class QuizNotFoundException extends RuntimeException {
    public QuizNotFoundException() {
        super("Quiz niet gevonden");
    }
}