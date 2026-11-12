package com.pubquiz.backend;

import com.pubquiz.backend.exception.ForbiddenException;
import com.pubquiz.backend.exception.InvalidGameStateException;
import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.GameEvent;
import com.pubquiz.backend.repository.GameRepository;
import com.pubquiz.backend.service.GameService;
import com.pubquiz.backend.service.QuestionBank;
import com.pubquiz.backend.service.QuizService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

// Unit test: geen Spring, geen database. De afhankelijkheden van GameService
// (repository, WebSocket-zender) zijn nep-objecten (mocks) van Mockito.
@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    private static final String GAME_CODE = "123456";
    private static final String HOST_ID = "host-1";

    @Mock
    private GameRepository gameRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private QuizService quizService;

    private GameService gameService;

    @BeforeEach
    void setUp() {
        // QuestionBank heeft zelf geen afhankelijkheden, dus we gebruiken de echte
        // demovragen. Een spel zonder quizId haalt zijn vragen daar vandaan.
        gameService = new GameService(gameRepository, messagingTemplate, new QuestionBank(), quizService);
    }

    @Test
    void startNextQuestion_fromLobby_startsQuestionAndBroadcasts() {
        // Arrange: een nieuw spel staat in de lobby
        Game game = new Game(GAME_CODE, HOST_ID);
        when(gameRepository.findForUpdate(GAME_CODE)).thenReturn(Optional.of(game));

        // Act
        boolean result = gameService.startNextQuestion(GAME_CODE, HOST_ID);

        // Assert
        assertThat(result).isTrue();
        assertThat(game.getGameState()).isEqualTo("QUESTION_ACTIVE");

        // De server moet QUESTION_STARTED naar het kanaal van dit spel sturen
        ArgumentCaptor<GameEvent> event = ArgumentCaptor.forClass(GameEvent.class);
        verify(messagingTemplate).convertAndSend(eq("/topic/game/" + GAME_CODE), event.capture());
        assertThat(event.getValue().getType()).isEqualTo("QUESTION_STARTED");
    }

    @Test
    void startNextQuestion_whileQuestionIsActive_isRejected() {
        // Arrange: vraag 1 loopt nog
        Game game = new Game(GAME_CODE, HOST_ID);
        game.startNextQuestion(20);
        when(gameRepository.findForUpdate(GAME_CODE)).thenReturn(Optional.of(game));

        // Act + Assert
        assertThatThrownBy(() -> gameService.startNextQuestion(GAME_CODE, HOST_ID))
                .isInstanceOf(InvalidGameStateException.class);

        // De vraag is niet overgeslagen en er is niets uitgezonden
        assertThat(game.getCurrentQuestionIndex()).isEqualTo(0);
        assertThat(game.getGameState()).isEqualTo("QUESTION_ACTIVE");
        verifyNoInteractions(messagingTemplate);
    }

    @Test
    void startNextQuestion_afterQuestionEnded_startsNextQuestion() {
        // Arrange: vraag 1 is afgelopen
        Game game = new Game(GAME_CODE, HOST_ID);
        game.startNextQuestion(20);
        game.endQuestion();
        when(gameRepository.findForUpdate(GAME_CODE)).thenReturn(Optional.of(game));

        // Act
        boolean result = gameService.startNextQuestion(GAME_CODE, HOST_ID);

        // Assert: nu is vraag 2 actief
        assertThat(result).isTrue();
        assertThat(game.getCurrentQuestionIndex()).isEqualTo(1);
        assertThat(game.getGameState()).isEqualTo("QUESTION_ACTIVE");
    }

    @Test
    void startNextQuestion_byOtherHost_isForbidden() {
        Game game = new Game(GAME_CODE, HOST_ID);
        when(gameRepository.findForUpdate(GAME_CODE)).thenReturn(Optional.of(game));

        assertThatThrownBy(() -> gameService.startNextQuestion(GAME_CODE, "andere-host"))
                .isInstanceOf(ForbiddenException.class);

        assertThat(game.getGameState()).isEqualTo("LOBBY");
        verifyNoInteractions(messagingTemplate);
    }

    @Test
    void startNextQuestion_forUnknownGame_returnsFalse() {
        when(gameRepository.findForUpdate("000000")).thenReturn(Optional.empty());

        boolean result = gameService.startNextQuestion("000000", HOST_ID);

        assertThat(result).isFalse();
        verifyNoInteractions(messagingTemplate);
    }
}