package com.pubquiz.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Player {

    // Gebruik van autoincremnt
    // Bewust geen getter: dit id gebruiken we alleen intern.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int score = 0;
    private Long totalAnswerTimeMs = 0L;

    // Totale antwoordtijd van alle goede antwoorden, voor de volgorde bij gelijke score.
    // Long (niet long): bestaande rijen in de database hebben hier nog NULL.
    public long getTotalAnswerTimeMs() {
        return totalAnswerTimeMs == null ? 0 : totalAnswerTimeMs;
    }

    public void addAnswerTime(long millis) {
        this.totalAnswerTimeMs = getTotalAnswerTimeMs() + millis;
    }

    // Verplicht voor JPA, wij gebruiken hem zelf niet
    protected Player() {
    }

    public Player(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public int getScore() {
        return score;
    }

    public void addScore(int points) {
        this.score += points;
    }
}