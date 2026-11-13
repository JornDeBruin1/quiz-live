package com.pubquiz.backend.service;

import com.pubquiz.backend.exception.ForbiddenException;
import com.pubquiz.backend.exception.InvalidGameStateException;
import com.pubquiz.backend.exception.QuizNotFoundException;
import com.pubquiz.backend.model.Game;
import com.pubquiz.backend.model.GameEvent;
import com.pubquiz.backend.model.Player;
import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import com.pubquiz.backend.repository.GameRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class GameService {

    private static final int QUESTION_DURATION_SECONDS = 20;
    private static final int MAX_POINTS = 1000;
    private static final int MIN_POINTS_IF_CORRECT = 100;

    private final GameRepository gameRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final QuestionBank questionBank;
    private final QuizService quizService;

    public GameService(GameRepository gameRepository, SimpMessagingTemplate messagingTemplate,
                       QuestionBank questionBank, QuizService quizService) {
        this.gameRepository = gameRepository;
        this.messagingTemplate = messagingTemplate;
        this.questionBank = questionBank;
        this.quizService = quizService;
    }

    // quizId mag null zijn - dan gebruiken we de demo-vragen uit QuestionBank
    public Game createGame(String quizId, String hostId) {
        if (quizId != null) {
            Quiz quiz = quizService.getOwnedQuiz(quizId, hostId);
            if (quiz == null) {
                throw new QuizNotFoundException();        
            }
        }
        Game game = new Game(generateGameCode(), hostId);
        game.setQuizId(quizId);
        return gameRepository.save(game);
    }

    public Game getGame(String gameCode) {
        return gameRepository.findById(gameCode).orElse(null);
    }

    // Vanaf hier: eerst vergrendelen (findForUpdate), dan wijzigen. De wijzigingen worden
    // aan het einde van de transactie vanzelf opgeslagen, een aparte save() is niet nodig.
    @Transactional
    public Player addPlayer(String gameCode, String playerName) {
        Game game = gameRepository.findForUpdate(gameCode).orElse(null);

        if (game == null) {
            return null;
        }

        Player player = new Player(playerName);
        game.addPlayer(player);

        broadcast(gameCode, "PLAYER_JOINED", game);

        return player;
    }

    @Transactional
    public boolean startNextQuestion(String gameCode, String hostId) {
        Game game = gameRepository.findForUpdate(gameCode).orElse(null);

        if (game == null) {
            return false;
        }
        if (!game.isOwnedBy(hostId)) {
            throw new ForbiddenException();
        }
        String state = game.getGameState();
        if (!state.equals("LOBBY") && !state.equals("QUESTION_ENDED")) {
            throw new InvalidGameStateException();
        }

        int nextIndex = game.getCurrentQuestionIndex() + 1;
        Question question = getQuestionAt(game, nextIndex);

        if (question == null) {
            broadcast(gameCode, "GAME_FINISHED", game.getPlayers());
            return true;
        }

        game.startNextQuestion(QUESTION_DURATION_SECONDS);

        QuestionForClient safeQuestion = new QuestionForClient(
                question.getText(),
                question.getAnswers(),
                game.getQuestionDeadline()
        );
        broadcast(gameCode, "QUESTION_STARTED", safeQuestion);

        return true;
    }

    @Transactional
    public boolean submitAnswer(String gameCode, String playerName, String answer) {
        Game game = gameRepository.findForUpdate(gameCode).orElse(null);

        if (game == null || !game.getGameState().equals("QUESTION_ACTIVE")) {
            return false;
        }

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

        Question currentQuestion = getQuestionAt(game, game.getCurrentQuestionIndex());
        boolean isCorrect = currentQuestion.getCorrectAnswer().equals(answer);

        if (isCorrect) {
            int points = calculatePoints(game);
            player.addScore(points);
        }

        broadcast(gameCode, "ANSWER_SUBMITTED", game);

        // Iedereen heeft geantwoord: niet wachten op de timer
        if (game.allPlayersAnswered()) {
            endQuestion(gameCode, game);
        }

        return true;
    }

    // De timer draait elke seconde en zoekt actieve spellen waarvan de tijd om is.
    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void checkDeadlines() {
        List<Game> activeGames = gameRepository.findByGameState("QUESTION_ACTIVE");

        for (Game game : activeGames) {
            if (game.isDeadlinePassed()) {
                endQuestion(game.getGameCode(), game);
            }
        }
    }

    private void endQuestion(String gameCode, Game game) {
        game.endQuestion();

        Question question = getQuestionAt(game, game.getCurrentQuestionIndex());

        QuestionResult result = new QuestionResult(
                question.getCorrectAnswer(),
                game.getPlayers()
        );
        broadcast(gameCode, "QUESTION_ENDED", result);
    }

    // Haalt een vraag op uit de gekoppelde quiz, of uit de demo-QuestionBank
    // als het spel geen specifieke quiz heeft.
    private Question getQuestionAt(Game game, int index) {
        if (game.getQuizId() == null) {
            return questionBank.getQuestion(index);
        }

        Quiz quiz = quizService.getQuiz(game.getQuizId());
        if (quiz == null || index < 0 || index >= quiz.getQuestions().size()) {
            return null;
        }
        return quiz.getQuestions().get(index);
    }

    private int calculatePoints(Game game) {
        long now = System.currentTimeMillis();
        long totalDuration = game.getQuestionDeadline() - game.getQuestionStartTime();
        long timeUsed = now - game.getQuestionStartTime();

        double fractionRemaining = 1.0 - ((double) timeUsed / totalDuration);
        fractionRemaining = Math.max(0.0, Math.min(1.0, fractionRemaining));

        int points = (int) (MAX_POINTS * fractionRemaining);
        return Math.max(MIN_POINTS_IF_CORRECT, points);
    }

    private void broadcast(String gameCode, String eventType, Object payload) {
        GameEvent event = new GameEvent(eventType, payload);
        messagingTemplate.convertAndSend("/topic/game/" + gameCode, event);
    }

    // Een gamecode is de primary key. Een dubbele code zou een bestaand spel
    // overschrijven, dus we kiezen opnieuw zolang de code al in de database staat.
    private String generateGameCode() {
        Random random = new Random();
        String code;

        do {
            code = String.valueOf(100000 + random.nextInt(900000));
        } while (gameRepository.existsById(code));

        return code;
    }

    private record QuestionForClient(String text, List<String> answers, long deadline) {
    }

    private record QuestionResult(String correctAnswer, List<Player> leaderboard) {
    }
}