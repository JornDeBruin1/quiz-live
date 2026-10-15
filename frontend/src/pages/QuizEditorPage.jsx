import { useNavigate } from "react-router-dom";
import useQuizEditor from "../hooks/useQuizEditor";

function QuizEditorPage() {
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    questions,
    updateQuestionText,
    updateAnswer,
    updateCorrectAnswer,
    addNewQuestion,
    removeQuestion,
    save,
  } = useQuizEditor();

  async function handleSave() {
    const quizId = await save();
    navigate(`/host?quizId=${quizId}`);
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

      <button onClick={addNewQuestion}>+ Vraag toevoegen</button>
      <button onClick={handleSave}>Quiz opslaan en spel starten</button>
    </div>
  );
}

export default QuizEditorPage;