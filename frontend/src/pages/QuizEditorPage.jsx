import { useNavigate } from "react-router-dom";
import useQuizEditor from "../hooks/useQuizEditor";
import QuestionEditor from "../components/QuestionEditor";

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

      <button onClick={addNewQuestion}>+ Vraag toevoegen</button>
      <button onClick={handleSave}>Quiz opslaan en spel starten</button>
    </div>
  );
}

export default QuizEditorPage;