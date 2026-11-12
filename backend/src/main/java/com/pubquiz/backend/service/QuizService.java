package com.pubquiz.backend.service;

import com.pubquiz.backend.exception.ForbiddenException;
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

    public Quiz createQuiz(String title, String ownerId) {
        Quiz quiz = new Quiz(UUID.randomUUID().toString(), title, ownerId);
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizzesOf(String ownerId) {
        return quizRepository.findByOwnerId(ownerId);
    }

    // Zonder eigenaarscontrole: alleen voor intern gebruik (GameService leest hiermee de vragen)
    public Quiz getQuiz(String id) {
        return quizRepository.findById(id).orElse(null);
    }

    // null als de quiz niet bestaat, ForbiddenException als hij van een ander is
    public Quiz getOwnedQuiz(String id, String hostId) {
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz != null && !quiz.isOwnedBy(hostId)) {
            throw new ForbiddenException();
        }
        return quiz;
    }

    @Transactional
    public Question addQuestion(String quizId, String hostId, String text,
                                List<String> answers, String correctAnswer) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);

        if (quiz == null) {
            return null;
        }
        if (!quiz.isOwnedBy(hostId)) {
            throw new ForbiddenException();
        }

        Question question = new Question(UUID.randomUUID().toString(), text, answers, correctAnswer);
        quiz.addQuestion(question);
        quizRepository.save(quiz);
        return question;
    }
}