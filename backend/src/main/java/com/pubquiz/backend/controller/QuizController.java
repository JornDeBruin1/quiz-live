package com.pubquiz.backend.controller;

import com.pubquiz.backend.api.QuizzesApi;
import com.pubquiz.backend.api.model.AddQuestionRequest;
import com.pubquiz.backend.api.model.CreateQuizRequest;
import com.pubquiz.backend.api.model.QuestionResponse;
import com.pubquiz.backend.api.model.QuizResponse;
import com.pubquiz.backend.mapper.QuizMapper;
import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import com.pubquiz.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuizController implements QuizzesApi {

    private final QuizService quizService;
    private final QuizMapper quizMapper;

    public QuizController(QuizService quizService, QuizMapper quizMapper) {
        this.quizService = quizService;
        this.quizMapper = quizMapper;
    }

    @Override
    public ResponseEntity<QuizResponse> createQuiz(CreateQuizRequest createQuizRequest) {
        Quiz quiz = quizService.createQuiz(createQuizRequest.getTitle());
        return ResponseEntity.ok(quizMapper.toQuizResponse(quiz));
    }

    @Override
    public ResponseEntity<QuizResponse> getQuiz(String id) {
        Quiz quiz = quizService.getQuiz(id);

        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(quizMapper.toQuizResponse(quiz));
    }

    @Override
    public ResponseEntity<QuestionResponse> addQuestion(String id, AddQuestionRequest addQuestionRequest) {
        Question question = quizService.addQuestion(
                id,
                addQuestionRequest.getText(),
                addQuestionRequest.getAnswers(),
                addQuestionRequest.getCorrectAnswer());

        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(quizMapper.toQuestionResponse(question));
    }
}