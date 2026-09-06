package com.pubquiz.backend.model;

import java.util.ArrayList;
import java.util.List;

public class Quiz {

    private String id;
    private String title;
    private List<Question> questions = new ArrayList<>();

    public Quiz(String id, String title) {
        this.id = id;
        this.title = title;
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