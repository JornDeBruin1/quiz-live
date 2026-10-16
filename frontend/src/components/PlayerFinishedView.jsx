function PlayerFinishedView({ playerName }) {
  return (
    <div className="player-game">
      <h1>Quiz afgelopen!</h1>
      <p>Bedankt voor het meespelen, {playerName}!</p>
    </div>
  );
}

export default PlayerFinishedView;