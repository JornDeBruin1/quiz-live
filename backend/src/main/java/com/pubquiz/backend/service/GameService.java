package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.GameEvent;
import com.pubquiz.backend.model.Player;
import com.pubquiz.backend.model.Question;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class GameService {

    private final Map<String, Game> games = new HashMap<>();
    private final SimpMessagingTemplate messagingTemplate;
    private final QuestionBank questionBank;

    public GameService(SimpMessagingTemplate messagingTemplate, QuestionBank questionBank) {
        this.messagingTemplate = messagingTemplate;
        this.questionBank = questionBank;
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

        broadcast(gameCode, "PLAYER_JOINED", game);

        return player;
    }

    public boolean startNextQuestion(String gameCode) {
        Game game = games.get(gameCode);

        if (game == null) {
            return false;
        }

        int nextIndex = game.getCurrentQuestionIndex() + 1;
        Question question = questionBank.getQuestion(nextIndex);

        if (question == null) {
            // Geen vragen meer over: het spel is klaar
            broadcast(gameCode, "GAME_FINISHED", game.getPlayers());
            return true;
        }

        game.startNextQuestion();

        // BELANGRIJK: we sturen hier NIET het correctAnswer-veld mee.
        // We bouwen een "veilige" versie van de vraag, zonder antwoord,
        // zodat spelers het correcte antwoord niet in het netwerkverkeer kunnen zien.
        QuestionForClient safeQuestion = new QuestionForClient(question.getText(), question.getAnswers());
        broadcast(gameCode, "QUESTION_STARTED", safeQuestion);

        return true;
    }

    public boolean submitAnswer(String gameCode, String playerName, String answer) {
        Game game = games.get(gameCode);

        if (game == null || !game.getGameState().equals("QUESTION_ACTIVE")) {
            return false;
        }

        if (game.hasPlayerAnswered(playerName)) {
            return false;
        }

        Player player = game.findPlayer(playerName);
        if (player == null) {
            return false;
        }

        game.markPlayerAnswered(playerName);

        Question currentQuestion = questionBank.getQuestion(game.getCurrentQuestionIndex());
        boolean isCorrect = currentQuestion.getCorrectAnswer().equals(answer);

        if (isCorrect) {
            player.addScore(100);
        }

        // Laat de host/screen weten hoeveel mensen al geantwoord hebben (zonder te verklappen wat ze antwoordden)
        broadcast(gameCode, "ANSWER_SUBMITTED", game);

        return true;
    }

    private void broadcast(String gameCode, String eventType, Object payload) {
        GameEvent event = new GameEvent(eventType, payload);
        messagingTemplate.convertAndSend("/topic/game/" + gameCode, event);
    }

    private String generateGameCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // Kleine, "veilige" weergave van een vraag - alleen tekst en antwoordopties,
    // bewust zonder het correcte antwoord erin.
    private record QuestionForClient(String text, java.util.List<String> answers) {
    }
}