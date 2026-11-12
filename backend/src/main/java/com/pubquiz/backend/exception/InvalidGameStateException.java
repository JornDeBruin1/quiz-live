package com.pubquiz.backend.exception;

// De actie is niet toegestaan in de huidige toestand van het spel
// (bijvoorbeeld: volgende vraag starten terwijl er nog een vraag loopt).
public class InvalidGameStateException extends RuntimeException {
}