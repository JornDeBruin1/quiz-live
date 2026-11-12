package com.pubquiz.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Quiz {

    @Id
    private String id;
    private String title;
    private String ownerId;

    // quiz_id in de question-tabel is de foreign key; position bewaart de volgorde.
    // cascade ALL: vragen worden automatisch mee opgeslagen en verwijderd met de quiz.
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id")
    @OrderColumn(name = "position")
    private List<Question> questions = new ArrayList<>();

    // Verplicht voor JPA, wij gebruiken hem zelf niet
    protected Quiz() {
    }

    public Quiz(String id, String title, String ownerId) {
        this.id = id;
        this.title = title;
        this.ownerId = ownerId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public boolean isOwnedBy(String hostId) {
        return ownerId != null && ownerId.equals(hostId);
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void addQuestion(Question question) {
        questions.add(question);
    }
    
}