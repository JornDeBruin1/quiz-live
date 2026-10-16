function PlayerResultView({ questionResult, selectedAnswer, playerName }) {
  const wasCorrect = selectedAnswer === questionResult.correctAnswer;
  const me = questionResult.leaderboard.find((p) => p.name === playerName);

  return (
    <div className="player-game">
      <p>Correct antwoord: {questionResult.correctAnswer}</p>
      <p>{wasCorrect ? "Goed!" : "Fout!"}</p>
      {me && <p>Jouw totaalscore: {me.score} punten</p>}
      <p>Wachten op de volgende vraag...</p>
    </div>
  );
}

export default PlayerResultView;