package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.GameEvent;
import com.pubquiz.backend.model.Player;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class GameService {

    private final Map<String, Game> games = new HashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    // Spring injecteert SimpMessagingTemplate automatisch, net als bij GameService in de Controller
    public GameService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

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

        // Zodra een speler toegevoegd is, laten we alle geabonneerde clients (Host, Screen) dit direct weten
        broadcast(gameCode, "PLAYER_JOINED", game);

        return player;
    }

    // Stuurt een GameEvent naar iedereen die geabonneerd is op het kanaal van dit specifieke spel
    private void broadcast(String gameCode, String eventType, Object payload) {
        GameEvent event = new GameEvent(eventType, payload);
        messagingTemplate.convertAndSend("/topic/game/" + gameCode, event);
    }

    private String generateGameCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}