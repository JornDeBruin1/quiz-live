package com.pubquiz.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Game {

    @Id
    private String gameCode;

    // game_code in de player-tabel is de foreign key; position bewaart de joinvolgorde
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "game_code")
    @OrderColumn(name = "position")
    private List<Player> players = new ArrayList<>();

    private String gameState = "LOBBY";
    private int currentQuestionIndex = -1;
    private long questionDeadline = 0;
    private long questionStartTime = 0;
    private String quizId;
    private String ownerId;

    // Bijhouden wie er al geantwoord heeft op de huidige vraag,
    // zodat niemand twee keer kan antwoorden
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_answered_players", joinColumns = @JoinColumn(name = "game_code"))
    @Column(name = "player_name")
    private Set<String> playersWhoAnswered = new HashSet<>();

    // Verplicht voor JPA, wij gebruiken hem zelf niet
    protected Game() {
    }

    public Game(String gameCode, String ownerId) {
        this.gameCode = gameCode;
        this.ownerId = ownerId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public boolean isOwnedBy(String hostId) {
        return ownerId != null && ownerId.equals(hostId);
    }

    public String getGameCode() {
        return gameCode;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public String getGameState() {
        return gameState;
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public long getQuestionDeadline() {
        return questionDeadline;
    }

    public long getQuestionStartTime() {
        return questionStartTime;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public void addPlayer(Player player) {
        players.add(player);
    }

    public void startNextQuestion(int durationSeconds) {
        currentQuestionIndex++;
        gameState = "QUESTION_ACTIVE";
        playersWhoAnswered.clear();
        questionStartTime = System.currentTimeMillis();
        questionDeadline = questionStartTime + (durationSeconds * 1000L);
    }

    public void endQuestion() {
        gameState = "QUESTION_ENDED";
    }

    // Is de deadline al verstreken?
    public boolean isDeadlinePassed() {
        return System.currentTimeMillis() > questionDeadline;
    }

    public boolean hasPlayerAnswered(String playerName) {
        return playersWhoAnswered.contains(playerName);
    }

    public void markPlayerAnswered(String playerName) {
        playersWhoAnswered.add(playerName);
    }

    public Player findPlayer(String playerName) {
        for (Player player : players) {
            if (player.getName().equals(playerName)) {
                return player;
            }
        }
        return null;
    }
}