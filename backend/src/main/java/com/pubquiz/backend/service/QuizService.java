package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class QuizService {

    private final Map<String, Quiz> quizzes = new HashMap<>();

    public Quiz createQuiz(String title) {
        String id = UUID.randomUUID().toString();
        Quiz quiz = new Quiz(id, title);
        quizzes.put(id, quiz);
        return quiz;
    }

    public Quiz getQuiz(String id) {
        return quizzes.get(id);
    }

    public Question addQuestion(String quizId, String text, java.util.List<String> answers, String correctAnswer) {
        Quiz quiz = quizzes.get(quizId);

        if (quiz == null) {
            return null;
        }

        String questionId = UUID.randomUUID().toString();
        Question question = new Question(questionId, text, answers, correctAnswer);
        quiz.addQuestion(question);
        return question;
    }
}