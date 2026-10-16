import Timer from "./Timer";

function QuestionView({ currentQuestion }) {
  return (
    <div className="screen-page">
      <Timer deadline={currentQuestion.deadline} />
      <h2>{currentQuestion.text}</h2>
      <ul className="answer-list">
        {currentQuestion.answers.map((answer) => (
          <li key={answer}>{answer}</li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionView;