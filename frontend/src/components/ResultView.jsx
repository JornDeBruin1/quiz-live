function ResultView({ questionResult }) {
  return (
    <div className="screen-page">
      <h2>Correct antwoord:</h2>
      <p className="correct-answer">{questionResult.correctAnswer}</p>
      <h3>Stand:</h3>
      <ol>
        {questionResult.leaderboard
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((player) => (
            <li key={player.name}>
              {player.name} — {player.score} punten
            </li>
          ))}
      </ol>
    </div>
  );
}

export default ResultView;