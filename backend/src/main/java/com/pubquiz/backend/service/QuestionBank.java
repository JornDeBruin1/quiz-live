package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Question;
import org.springframework.stereotype.Component;

import java.util.List;

// Tijdelijke, hardcoded vragenset. In Fase 9/10 wordt dit vervangen
// door vragen die de host zelf maakt en die in een database staan.
@Component
public class QuestionBank {

    private final List<Question> questions = List.of(
            new Question(
                    "Wat is de hoofdstad van Frankrijk?",
                    List.of("Amsterdam", "Parijs", "Madrid", "Rome"),
                    "Parijs"
            ),
            new Question(
                    "Welke planeet staat bekend als de rode planeet?",
                    List.of("Venus", "Jupiter", "Mars", "Saturnus"),
                    "Mars"
            ),
            new Question(
                    "In welk jaar viel de Berlijnse Muur?",
                    List.of("1987", "1989", "1991", "1993"),
                    "1989"
            )
    );

    public List<Question> getQuestions() {
        return questions;
    }

    public Question getQuestion(int index) {
        if (index < 0 || index >= questions.size()) {
            return null;
        }
        return questions.get(index);
    }

    public int getTotalQuestions() {
        return questions.size();
    }
}