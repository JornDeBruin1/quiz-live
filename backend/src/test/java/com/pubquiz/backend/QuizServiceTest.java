package com.pubquiz.backend;

import com.pubquiz.backend.exception.ForbiddenException;
import com.pubquiz.backend.exception.InvalidQuestionException;
import com.pubquiz.backend.model.Question;
import com.pubquiz.backend.model.Quiz;
import com.pubquiz.backend.repository.QuizRepository;
import com.pubquiz.backend.service.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    private static final String QUIZ_ID = "quiz-1";
    private static final String HOST_ID = "host-1";

    @Mock
    private QuizRepository quizRepository;

    private QuizService quizService;

    @BeforeEach
    void setUp() {
        quizService = new QuizService(quizRepository);
    }

    @Test
    void addQuestion_withValidQuestion_addsAndSaves() {
        Quiz quiz = new Quiz(QUIZ_ID, "Testquiz", HOST_ID);
        when(quizRepository.findById(QUIZ_ID)).thenReturn(Optional.of(quiz));

        Question question = quizService.addQuestion(
                QUIZ_ID, HOST_ID, "Hoofdstad van Nederland?",
                List.of("Amsterdam", "Utrecht"), "Amsterdam");

        assertThat(question.getCorrectAnswer()).isEqualTo("Amsterdam");
        assertThat(quiz.getQuestions()).hasSize(1);
        verify(quizRepository).save(quiz);
    }

    @Test
    void addQuestion_whenCorrectAnswerNotInAnswers_isRejected() {
        Quiz quiz = new Quiz(QUIZ_ID, "Testquiz", HOST_ID);
        when(quizRepository.findById(QUIZ_ID)).thenReturn(Optional.of(quiz));

        assertThatThrownBy(() -> quizService.addQuestion(
                QUIZ_ID, HOST_ID, "Vraag?", List.of("a", "b"), "c"))
                .isInstanceOf(InvalidQuestionException.class);

        assertThat(quiz.getQuestions()).isEmpty();
    }

    @Test
    void addQuestion_byOtherHost_isForbidden() {
        Quiz quiz = new Quiz(QUIZ_ID, "Testquiz", HOST_ID);
        when(quizRepository.findById(QUIZ_ID)).thenReturn(Optional.of(quiz));

        assertThatThrownBy(() -> quizService.addQuestion(
                QUIZ_ID, "andere-host", "Vraag?", List.of("a", "b"), "a"))
                .isInstanceOf(ForbiddenException.class);

        assertThat(quiz.getQuestions()).isEmpty();
    }

    @Test
    void addQuestion_forUnknownQuiz_returnsNull() {
        when(quizRepository.findById("onbekend")).thenReturn(Optional.empty());

        Question question = quizService.addQuestion(
                "onbekend", HOST_ID, "Vraag?", List.of("a", "b"), "a");

        assertThat(question).isNull();
        verifyNoMoreInteractions(quizRepository);
    }
}