package com.pubquiz.backend.controller;

import com.pubquiz.backend.api.QuizzesApi;
import com.pubquiz.backend.api.model.AddQuestionRequest;
import com.pubquiz.backend.api.model.CreateQuizRequest;
import com.pubquiz.backend.api.model.QuestionResponse;
import com.pubquiz.backend.api.model.QuizResponse;
import com.pubquiz.backend.config.CurrentHost;
import com.pubquiz.backend.mapper.QuizMapper;
import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import com.pubquiz.backend.service.QuizService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuizController implements QuizzesApi {

    private final QuizService quizService;
    private final QuizMapper quizMapper;
    private final CurrentHost currentHost;

    public QuizController(QuizService quizService, QuizMapper quizMapper, CurrentHost currentHost) {
        this.quizService = quizService;
        this.quizMapper = quizMapper;
        this.currentHost = currentHost;
    }

    @Override
public ResponseEntity<QuizResponse> createQuiz(CreateQuizRequest createQuizRequest) {
    Quiz quiz = quizService.createQuiz(createQuizRequest.getTitle(), currentHost.id());
    return ResponseEntity.ok(quizMapper.toQuizResponse(quiz));
}

@Override
public ResponseEntity<List<QuizResponse>> listMyQuizzes() {
    List<QuizResponse> quizzes = quizService.getQuizzesOf(currentHost.id()).stream()
            .map(quizMapper::toQuizResponse)
            .toList();
    return ResponseEntity.ok(quizzes);
}

@Override
public ResponseEntity<QuizResponse> getQuiz(String id) {
    Quiz quiz = quizService.getOwnedQuiz(id, currentHost.id());
    if (quiz == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(quizMapper.toQuizResponse(quiz));
}

@Override
public ResponseEntity<QuestionResponse> addQuestion(String id, AddQuestionRequest addQuestionRequest) {
    Question question = quizService.addQuestion(
            id,
            currentHost.id(),
            addQuestionRequest.getText(),
            addQuestionRequest.getAnswers(),
            addQuestionRequest.getCorrectAnswer());

    if (question == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(quizMapper.toQuestionResponse(question));
}
}