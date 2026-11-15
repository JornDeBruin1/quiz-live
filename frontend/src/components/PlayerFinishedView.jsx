import { rankPlayers } from "../utils/standings";

function PlayerFinishedView({ playerName, standings }) {
  const ranked = rankPlayers(standings ?? []);
  const top3 = ranked.filter((p) => p.rank <= 3);
  const me = ranked.find((p) => p.name === playerName);

  return (
    <div className="player-game">
      <h1>Quiz afgelopen!</h1>
      <ol className="leaderboard">
        {top3.map((player) => (
          <li key={player.name} value={player.rank}>
            <span className="name">{player.name}</span>
            <span>{player.score} punten</span>
          </li>
        ))}
      </ol>
      {me && me.rank > 3 && (
        <p>Jij: <strong>{me.rank}e plek</strong>, {me.score} punten</p>
      )}
      <p className="muted">Bedankt voor het meespelen, {playerName}!</p>
    </div>
  );
}

export default PlayerFinishedView;