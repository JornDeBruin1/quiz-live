import { rankPlayers } from "../utils/standings";

function FinalStandingsView({ standings }) {
  const top3 = rankPlayers(standings).filter((p) => p.rank <= 3);

  return (
    <div className="screen-page">
      <h1>Eindstand</h1>
      <ol className="leaderboard">
        {top3.map((player) => (
          <li key={player.name}>
            <span className="name">{player.rank}. {player.name}</span>
            <span>{player.score} punten</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default FinalStandingsView;