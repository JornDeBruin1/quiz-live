package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.Player;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class GameService {

    private final Map<String, Game> games = new HashMap<>();

    public Game createGame() {
        String gameCode = generateGameCode();
        Game game = new Game(gameCode);
        games.put(gameCode, game);
        return game;
    }

    public Game getGame(String gameCode) {
        return games.get(gameCode);
    }

    public Player addPlayer(String gameCode, String playerName) {
        Game game = games.get(gameCode);

        if (game == null) {
            return null;
        }

        Player player = new Player(playerName);
        game.addPlayer(player);
        return player;
    }

    private String generateGameCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}