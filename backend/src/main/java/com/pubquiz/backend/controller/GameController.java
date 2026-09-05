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
    public Game createGame() {
        return gameService.createGame();
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

    public record PlayerRequest(String name) {
    }
}