function PlayerResultView({ questionResult, selectedAnswer, playerName }) {
  const wasCorrect = selectedAnswer === questionResult.correctAnswer;
  const me = questionResult.leaderboard.find((p) => p.name === playerName);

  return (
    <div className="player-game">
      <p
        className={`result-banner ${wasCorrect ? "correct" : "incorrect"}`}
        role="status"
      >
        {wasCorrect ? "Goed!" : "Fout!"}
      </p>
      <p>Correct antwoord: <strong>{questionResult.correctAnswer}</strong></p>
      {me && <p>Jouw totaalscore: <strong>{me.score} punten</strong></p>}
      <p className="muted">Wachten op de volgende vraag...</p>
    </div>
  );
}

export default PlayerResultView;