import { useState } from "react";
import AnswerOption from "./AnswerOption";

function Question({ question, onAnswered }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  function handleSelect(answer) {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === question.correctAnswer;
    onAnswered(isCorrect);
  }

  return (
    <div className="question">
      <h2>{question.text}</h2>
      <div className="answers">
        {question.answers.map((answer) => (
          <AnswerOption
            key={answer}
            text={answer}
            onSelect={() => handleSelect(answer)}
            isSelected={answer === selectedAnswer}
            isCorrect={answer === question.correctAnswer}
            showResult={showResult}
          />
        ))}
      </div>
    </div>
  );
}

export default Question;