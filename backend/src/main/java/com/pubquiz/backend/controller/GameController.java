package com.pubquiz.backend.controller;

import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.Player;
import com.pubquiz.backend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public Game createGame(@RequestBody(required = false) CreateGameRequest request) {
        String quizId = request != null ? request.quizId() : null;
        return gameService.createGame(quizId);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Game> getGame(@PathVariable String code) {
        Game game = gameService.getGame(code);

        if (game == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(game);
    }

    @PostMapping("/{code}/players")
    public ResponseEntity<Player> addPlayer(
            @PathVariable String code,
            @RequestBody PlayerRequest request) {

        Player player = gameService.addPlayer(code, request.name());

        if (player == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(player);
    }

    // De host roept dit aan om de volgende vraag te starten
    @PostMapping("/{code}/next-question")
    public ResponseEntity<Void> startNextQuestion(@PathVariable String code) {
        boolean success = gameService.startNextQuestion(code);

        if (!success) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    // Een speler stuurt zijn antwoord in
    @PostMapping("/{code}/answer")
    public ResponseEntity<Void> submitAnswer(
            @PathVariable String code,
            @RequestBody AnswerRequest request) {

        boolean success = gameService.submitAnswer(code, request.playerName(), request.answer());

        if (!success) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();
    }

    public record PlayerRequest(String name) {
    }

    public record AnswerRequest(String playerName, String answer) {
    }
    public record CreateGameRequest(String quizId) {
    }
}