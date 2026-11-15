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

  // Spaties weg en lege antwoordvelden eruit, zodat spelers geen lege knoppen zien
  function cleanQuestions() {
    return questions.map((q) => ({
      text: q.text.trim(),
      answers: q.answers.map((a) => a.trim()).filter((a) => a !== ""),
      correctAnswer: q.correctAnswer.trim(),
    }));
  }

  // Geeft een melding voor de eerste fout, of null als alles klopt
  function validate() {
    if (title.trim() === "") {
      return "Geef de quiz een titel.";
    }

    const cleaned = cleanQuestions();
    for (let i = 0; i < cleaned.length; i++) {
      const q = cleaned[i];
      const n = i + 1;

      if (q.text === "") {
        return `Vraag ${n} heeft nog geen vraagtekst.`;
      }
      if (q.answers.length < 2) {
        return `Vraag ${n} heeft minstens twee antwoorden nodig.`;
      }
      if (new Set(q.answers).size !== q.answers.length) {
        return `Vraag ${n} heeft twee keer hetzelfde antwoord.`;
      }
      if (q.correctAnswer === "") {
        return `Kies bij vraag ${n} het juiste antwoord.`;
      }
      if (!q.answers.includes(q.correctAnswer)) {
        return `Het juiste antwoord van vraag ${n} komt niet meer voor bij de antwoorden. Kies het opnieuw.`;
      }
    }

    return null;
  }

  async function save() {
    const quiz = await createQuiz(title.trim());

    for (const question of cleanQuestions()) {
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
    validate,
    save,
  };
}

export default useQuizEditor;