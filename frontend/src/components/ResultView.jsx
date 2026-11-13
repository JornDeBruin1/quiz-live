function ResultView({ questionResult }) {
  return (
    <div className="screen-page">
      <h2>Correct antwoord:</h2>
      <p className="correct-answer">{questionResult.correctAnswer}</p>
      <h3>Stand:</h3>
      <ol className="leaderboard">
        {questionResult.leaderboard
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((player) => (
            <li key={player.name}>
              <span className="name">{player.name}</span>
              <span>{player.score} punten</span>
            </li>
          ))}
      </ol>
    </div>
  );
}

export default ResultView;