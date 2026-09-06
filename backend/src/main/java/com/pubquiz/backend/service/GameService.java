package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.GameEvent;
import com.pubquiz.backend.model.Player;
import com.pubquiz.backend.model.Question;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class GameService {

    // Hoe lang een vraag duurt in seconden
    private static final int QUESTION_DURATION_SECONDS = 20;

    private final Map<String, Game> games = new HashMap<>();
    private final SimpMessagingTemplate messagingTemplate;
    private final QuestionBank questionBank;
    private static final int MAX_POINTS = 1000;
    private static final int MIN_POINTS_IF_CORRECT = 100;

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
            broadcast(gameCode, "GAME_FINISHED", game.getPlayers());
            return true;
        }

        game.startNextQuestion(QUESTION_DURATION_SECONDS);

        // Stuur de veilige vraag (zonder correctAnswer) mét de deadline naar de clients
        QuestionForClient safeQuestion = new QuestionForClient(
                question.getText(),
                question.getAnswers(),
                game.getQuestionDeadline()
        );
        broadcast(gameCode, "QUESTION_STARTED", safeQuestion);

        return true;
    }

    public boolean submitAnswer(String gameCode, String playerName, String answer) {
        Game game = games.get(gameCode);

        if (game == null || !game.getGameState().equals("QUESTION_ACTIVE")) {
            return false;
        }

        // Weiger antwoorden die na de deadline binnenkomen
        if (game.isDeadlinePassed()) {
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
            int points = calculatePoints(game);
            player.addScore(points);
        }

        broadcast(gameCode, "ANSWER_SUBMITTED", game);

        return true;
    }
    // Hoe sneller geantwoord, hoe meer punten. Lineair van MAX_POINTS (direct)
    // tot MIN_POINTS_IF_CORRECT (op de valreep), altijd 0 bij een fout antwoord.
    private int calculatePoints(Game game) {
        long now = System.currentTimeMillis();
        long totalDuration = game.getQuestionDeadline() - game.getQuestionStartTime();
        long timeUsed = now - game.getQuestionStartTime();

        // Zorg dat we nooit buiten de 0-1 range rekenen, ook niet bij afrondingsverschillen
        double fractionRemaining = 1.0 - ((double) timeUsed / totalDuration);
        fractionRemaining = Math.max(0.0, Math.min(1.0, fractionRemaining));

        int points = (int) (MAX_POINTS * fractionRemaining);
        return Math.max(MIN_POINTS_IF_CORRECT, points);
    }

    // Controleer elke seconde of er vragen zijn waarvan de tijd verstreken is.
    // @Scheduled laat Spring Boot dit automatisch op de achtergrond uitvoeren.
    @Scheduled(fixedDelay = 1000)
    public void checkDeadlines() {
        for (Map.Entry<String, Game> entry : games.entrySet()) {
            String gameCode = entry.getKey();
            Game game = entry.getValue();

            if (game.getGameState().equals("QUESTION_ACTIVE") && game.isDeadlinePassed()) {
                endQuestion(gameCode, game);
            }
        }
    }

    private void endQuestion(String gameCode, Game game) {
        game.endQuestion();

        Question question = questionBank.getQuestion(game.getCurrentQuestionIndex());

        // Nu de tijd voorbij is, sturen we WEL het correcte antwoord mee
        // zodat het grote scherm (en de host) het kunnen tonen
        QuestionResult result = new QuestionResult(
                question.getCorrectAnswer(),
                game.getPlayers()
        );
        broadcast(gameCode, "QUESTION_ENDED", result);
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

    // Veilige vraagweergave voor clients: geen correctAnswer, wél de deadline
    private record QuestionForClient(String text, List<String> answers, long deadline) {
    }

    // Resultaat na afloop van een vraag: nu wél het correcte antwoord + scores
    private record QuestionResult(String correctAnswer, List<Player> leaderboard) {
    }
}