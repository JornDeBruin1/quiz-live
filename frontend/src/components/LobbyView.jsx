function LobbyView({ gameCode, players }) {
  return (
    <div className="screen-page">
      <h1>PubQuiz</h1>
      <p className="muted">Gamecode</p>
      <p className="game-code">{gameCode}</p>
      <h2>Spelers ({players.length})</h2>
      <ul className="player-list">
        {players.map((player) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default LobbyView;