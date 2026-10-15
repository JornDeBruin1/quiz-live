package com.pubquiz.backend.mapper;

import com.pubquiz.backend.api.model.GameResponse;
import com.pubquiz.backend.api.model.GameState;
import com.pubquiz.backend.api.model.PlayerResponse;
import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.Player;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

    public GameResponse toGameResponse(Game game) {
        return new GameResponse()
                .gameCode(game.getGameCode())
                .players(game.getPlayers().stream().map(this::toPlayerResponse).toList())
                .gameState(GameState.fromValue(game.getGameState()))
                .currentQuestionIndex(game.getCurrentQuestionIndex())
                .questionDeadline(game.getQuestionDeadline())
                .questionStartTime(game.getQuestionStartTime())
                .quizId(game.getQuizId());
    }

    public PlayerResponse toPlayerResponse(Player player) {
        return new PlayerResponse()
                .name(player.getName())
                .score(player.getScore());
    }
}