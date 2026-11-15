function PlayerResultView({ questionResult, selectedAnswer, playerName }) {
  const answered = Boolean(selectedAnswer);
  const wasCorrect = answered && selectedAnswer === questionResult.correctAnswer;
  const me = questionResult.leaderboard.find((p) => p.name === playerName);

  let bannerText = "Fout!";
  let bannerClass = "incorrect";
  if (wasCorrect) {
    bannerText = "Goed!";
    bannerClass = "correct";
  } else if (!answered) {
    bannerText = "Geen antwoord";
    bannerClass = "incorrect no-answer";
  }

  return (
    <div className="player-game">
      <p className={`result-banner ${bannerClass}`} role="status">
        {bannerText}
      </p>
      <p>Correct antwoord: <strong>{questionResult.correctAnswer}</strong></p>
      {me && <p>Jouw totaalscore: <strong>{me.score} punten</strong></p>}
      <p className="muted">Wachten op de volgende vraag...</p>
    </div>
  );
}

export default PlayerResultView;