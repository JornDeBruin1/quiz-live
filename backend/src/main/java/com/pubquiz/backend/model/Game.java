package com.pubquiz.backend.model;

import java.util.ArrayList;
import java.util.List;

public class Game {

    private String gameCode;
    private List<Player> players = new ArrayList<>();
    private String gameState = "LOBBY";

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

    public void addPlayer(Player player) {
        players.add(player);
    }
}