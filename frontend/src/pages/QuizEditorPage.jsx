import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

function emptyQuestion() {
  return { text: "", answers: ["", "", "", ""], correctAnswer: "" };
}

function QuizEditorPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const navigate = useNavigate();

  function updateQuestionText(index, text) {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  }

  function updateAnswer(questionIndex, answerIndex, value) {
    const updated = [...questions];
    updated[questionIndex].answers[answerIndex] = value;
    setQuestions(updated);
  }

  function updateCorrectAnswer(questionIndex, value) {
    const updated = [...questions];
    updated[questionIndex].correctAnswer = value;
    setQuestions(updated);
  }

  function addQuestion() {
    setQuestions([...questions, emptyQuestion()]);
  }

  function removeQuestion(index) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  async function handleSave() {
    // Eerst de quiz zelf aanmaken, dan pas kunnen we vragen toevoegen
    // (de backend moet immers eerst een quizId teruggeven)
    const quizResponse = await fetch(`${API_BASE_URL}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const quiz = await quizResponse.json();

    // Elke vraag apart versturen naar de zojuist aangemaakte quiz
    for (const question of questions) {
      await fetch(`${API_BASE_URL}/quizzes/${quiz.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
    }

    navigate(`/host?quizId=${quiz.id}`);
  }

  return (
    <div className="quiz-editor">
      <h1>Nieuwe quiz maken</h1>

      <input
        type="text"
        placeholder="Titel van de quiz"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {questions.map((question, qIndex) => (
        <div className="question-editor" key={qIndex}>
          <h3>Vraag {qIndex + 1}</h3>
          <input
            type="text"
            placeholder="Vraagtekst"
            value={question.text}
            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
          />

          {question.answers.map((answer, aIndex) => (
            <input
              key={aIndex}
              type="text"
              placeholder={`Antwoord ${aIndex + 1}`}
              value={answer}
              onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
            />
          ))}

          <select
            value={question.correctAnswer}
            onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
          >
            <option value="">Kies het juiste antwoord</option>
            {question.answers.map(
              (answer, aIndex) =>
                answer && (
                  <option key={aIndex} value={answer}>
                    {answer}
                  </option>
                )
            )}
          </select>

          {questions.length > 1 && (
            <button onClick={() => removeQuestion(qIndex)}>
              Verwijder vraag
            </button>
          )}
        </div>
      ))}

      <button onClick={addQuestion}>+ Vraag toevoegen</button>
      <button onClick={handleSave}>Quiz opslaan en spel starten</button>
    </div>
  );
}

export default QuizEditorPage;