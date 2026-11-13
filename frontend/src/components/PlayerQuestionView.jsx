import Timer from "./Timer";

function PlayerQuestionView({ currentQuestion, onAnswer }) {
  return (
    <div className="player-game">
      <Timer deadline={currentQuestion.deadline} />
      <h2>{currentQuestion.text}</h2>
      <div className="answers">
        {currentQuestion.answers.map((answer) => (
          <button
            key={answer}
            className="answer-option"
            onClick={() => onAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlayerQuestionView;