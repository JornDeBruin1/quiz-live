import { useNavigate } from "react-router-dom";
import useQuizEditor from "../hooks/useQuizEditor";
import QuestionEditor from "../components/QuestionEditor";
import { useState } from "react";
import { describeGameError } from "../api/GameErrors";

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
    validate,
    save,
  } = useQuizEditor();

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const quizId = await save();
      navigate(`/host?quizId=${quizId}`);
    } catch (err) {
      setError(describeGameError(err));
      setSaving(false);
    }
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
          <QuestionEditor
            key={qIndex}
            question={question}
            number={qIndex + 1}
            canRemove={questions.length > 1}
            onTextChange={(text) => updateQuestionText(qIndex, text)}
            onAnswerChange={(aIndex, text) => updateAnswer(qIndex, aIndex, text)}
            onCorrectAnswerChange={(answer) => updateCorrectAnswer(qIndex, answer)}
            onRemove={() => removeQuestion(qIndex)}
          />
        ))}

      <button className="secondary" onClick={addNewQuestion}>+ Vraag toevoegen</button>
      <button onClick={handleSave} disabled={saving}>
        {saving ? "Bezig met opslaan..." : "Quiz opslaan en spel starten"}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

export default QuizEditorPage;