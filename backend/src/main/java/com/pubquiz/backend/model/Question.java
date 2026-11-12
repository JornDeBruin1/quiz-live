package com.pubquiz.backend.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OrderColumn;

import java.util.List;

@Entity
public class Question {

    @Id
    private String id;
    private String text;

    @ElementCollection(fetch = FetchType.EAGER)
    @OrderColumn(name = "position")
    private List<String> answers;

    private String correctAnswer;

    protected Question() {
    }

    public Question(String id, String text, List<String> answers, String correctAnswer) {
        this.id = id;
        this.text = text;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    public String getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }
}