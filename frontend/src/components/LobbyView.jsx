function LobbyView({ gameCode, players }) {
  return (
    <div className="screen-page">
      <h1>PubQuiz</h1>
      <p>Gamecode: {gameCode}</p>
      <h2>Spelers ({players.length})</h2>
      <ul>
        {players.map((player) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default LobbyView;