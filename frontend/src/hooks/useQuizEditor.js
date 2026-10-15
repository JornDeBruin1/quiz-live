import { useState } from "react";
import { createQuiz, addQuestion } from "../api/quizApi";

function emptyQuestion() {
  return { text: "", answers: ["", "", "", ""], correctAnswer: "" };
}

// Formulierstate en opslaan van de quiz-editor. De pagina toont alleen.
function useQuizEditor() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);

  function updateQuestionText(index, text) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  }

  function updateAnswer(questionIndex, answerIndex, value) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== questionIndex
          ? q
          : {
              ...q,
              answers: q.answers.map((a, j) => (j === answerIndex ? value : a)),
            }
      )
    );
  }

  function updateCorrectAnswer(questionIndex, value) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex ? { ...q, correctAnswer: value } : q
      )
    );
  }

  function addNewQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  // Eerst de quiz aanmaken (de backend geeft het quizId), dan elke vraag
  // apart toevoegen. Geeft het quizId terug zodat de pagina kan navigeren.
  async function save() {
    const quiz = await createQuiz(title);

    for (const question of questions) {
      await addQuestion(quiz.id, question);
    }

    return quiz.id;
  }

  return {
    title,
    setTitle,
    questions,
    updateQuestionText,
    updateAnswer,
    updateCorrectAnswer,
    addNewQuestion,
    removeQuestion,
    save,
  };
}

export default useQuizEditor;