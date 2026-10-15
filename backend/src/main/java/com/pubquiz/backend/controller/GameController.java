package com.pubquiz.backend.controller;

import com.pubquiz.backend.api.GamesApi;
import com.pubquiz.backend.api.model.AnswerRequest;
import com.pubquiz.backend.api.model.CreateGameRequest;
import com.pubquiz.backend.api.model.GameResponse;
import com.pubquiz.backend.api.model.JoinGameRequest;
import com.pubquiz.backend.api.model.PlayerResponse;
import com.pubquiz.backend.mapper.GameMapper;
import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.Player;
import com.pubquiz.backend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GameController implements GamesApi {

    private final GameService gameService;
    private final GameMapper gameMapper;

    public GameController(GameService gameService, GameMapper gameMapper) {
        this.gameService = gameService;
        this.gameMapper = gameMapper;
    }

    @Override
    public ResponseEntity<GameResponse> createGame(CreateGameRequest createGameRequest) {
        Game game = gameService.createGame(createGameRequest.getQuizId());
        return ResponseEntity.ok(gameMapper.toGameResponse(game));
    }

    @Override
    public ResponseEntity<GameResponse> getGame(String code) {
        Game game = gameService.getGame(code);

        if (game == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(gameMapper.toGameResponse(game));
    }

    @Override
    public ResponseEntity<PlayerResponse> joinGame(String code, JoinGameRequest joinGameRequest) {
        Player player = gameService.addPlayer(code, joinGameRequest.getName());

        if (player == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(gameMapper.toPlayerResponse(player));
    }

    // De host roept dit aan om de volgende vraag te starten
    @Override
    public ResponseEntity<Void> startNextQuestion(String code) {
        boolean success = gameService.startNextQuestion(code);

        if (!success) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    // Een speler stuurt zijn antwoord in
    @Override
    public ResponseEntity<Void> submitAnswer(String code, AnswerRequest answerRequest) {
        boolean success = gameService.submitAnswer(code, answerRequest.getPlayerName(), answerRequest.getAnswer());

        if (!success) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();
    }
}