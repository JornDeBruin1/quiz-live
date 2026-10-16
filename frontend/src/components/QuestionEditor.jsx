function QuestionEditor({
  question,
  number,
  canRemove,
  onTextChange,
  onAnswerChange,
  onCorrectAnswerChange,
  onRemove,
}) {
  return (
    <div className="question-editor">
      <h3>Vraag {number}</h3>
      <input
        type="text"
        placeholder="Vraagtekst"
        value={question.text}
        onChange={(e) => onTextChange(e.target.value)}
      />

      {question.answers.map((answer, aIndex) => (
        <input
          key={aIndex}
          type="text"
          placeholder={`Antwoord ${aIndex + 1}`}
          value={answer}
          onChange={(e) => onAnswerChange(aIndex, e.target.value)}
        />
      ))}

      <select
        value={question.correctAnswer}
        onChange={(e) => onCorrectAnswerChange(e.target.value)}
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

      {canRemove && <button onClick={onRemove}>Verwijder vraag</button>}
    </div>
  );
}

export default QuestionEditor;