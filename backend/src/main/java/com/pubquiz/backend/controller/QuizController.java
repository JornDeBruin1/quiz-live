package com.pubquiz.backend.controller;

import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import com.pubquiz.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public Quiz createQuiz(@RequestBody CreateQuizRequest request) {
        return quizService.createQuiz(request.title());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable String id) {
        Quiz quiz = quizService.getQuiz(id);

        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<Question> addQuestion(
            @PathVariable String id,
            @RequestBody AddQuestionRequest request) {

        Question question = quizService.addQuestion(
                id, request.text(), request.answers(), request.correctAnswer());

        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(question);
    }

    public record CreateQuizRequest(String title) {
    }

    public record AddQuestionRequest(String text, List<String> answers, String correctAnswer) {
    }
}