package com.pubquiz.backend.model;

import java.util.List;

public class Question {

    private String id;
    private String text;
    private List<String> answers;
    private String correctAnswer;

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