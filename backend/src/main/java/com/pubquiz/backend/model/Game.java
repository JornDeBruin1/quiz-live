package com.pubquiz.backend.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Game {

    private String gameCode;
    private List<Player> players = new ArrayList<>();
    private String gameState = "LOBBY";
    private int currentQuestionIndex = -1;

    // Bijhouden wie er al geantwoord heeft op de huidige vraag,
    // zodat niemand twee keer kan antwoorden
    private Set<String> playersWhoAnswered = new HashSet<>();

    public Game(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getGameCode() {
        return gameCode;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public String getGameState() {
        return gameState;
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void addPlayer(Player player) {
        players.add(player);
    }

    public void startNextQuestion() {
        currentQuestionIndex++;
        gameState = "QUESTION_ACTIVE";
        playersWhoAnswered.clear();
    }

    public void endQuestion() {
        gameState = "QUESTION_ENDED";
    }

    public boolean hasPlayerAnswered(String playerName) {
        return playersWhoAnswered.contains(playerName);
    }

    public void markPlayerAnswered(String playerName) {
        playersWhoAnswered.add(playerName);
    }

    public Player findPlayer(String playerName) {
        for (Player player : players) {
            if (player.getName().equals(playerName)) {
                return player;
            }
        }
        return null;
    }
}