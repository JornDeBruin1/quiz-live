package com.pubquiz.backend.mapper;

import com.pubquiz.backend.api.model.QuestionResponse;
import com.pubquiz.backend.api.model.QuizResponse;
import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import org.springframework.stereotype.Component;

@Component
public class QuizMapper {

    public QuizResponse toQuizResponse(Quiz quiz) {
        return new QuizResponse()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .questions(quiz.getQuestions().stream().map(this::toQuestionResponse).toList());
    }

    public QuestionResponse toQuestionResponse(Question question) {
        return new QuestionResponse()
                .id(question.getId())
                .text(question.getText())
                .answers(question.getAnswers())
                .correctAnswer(question.getCorrectAnswer());
    }
}