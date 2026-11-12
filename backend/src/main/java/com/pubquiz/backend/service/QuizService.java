package com.pubquiz.backend.service;

import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import com.pubquiz.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public Quiz createQuiz(String title) {
        Quiz quiz = new Quiz(UUID.randomUUID().toString(), title);
        return quizRepository.save(quiz);
    }

    // findById geeft een Optional; met orElse(null) blijft de service zich
    // gedragen als eerst, dus de controller hoeft niet te veranderen
    public Quiz getQuiz(String id) {
        return quizRepository.findById(id).orElse(null);
    }

    // @Transactional: ophalen en opslaan gebeuren in één database-transactie
    @Transactional
    public Question addQuestion(String quizId, String text, List<String> answers, String correctAnswer) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);

        if (quiz == null) {
            return null;
        }

        Question question = new Question(UUID.randomUUID().toString(), text, answers, correctAnswer);
        quiz.addQuestion(question);
        quizRepository.save(quiz);
        return question;
    }
}