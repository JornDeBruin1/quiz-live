function AnswerOption({ text, onSelect, isSelected, isCorrect, showResult }) {
  let className = "answer-option";

  if (showResult) {
    if (isCorrect) {
      className += " correct";
    } else if (isSelected) {
      className += " incorrect";
    }
  } else if (isSelected) {
    className += " selected";
  }

  return (
    <button className={className} onClick={onSelect} disabled={showResult}>
      {text}
    </button>
  );
}

export default AnswerOption;