import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";

const API_BASE_URL = "http://localhost:8080/api";

function HostPage() {
  const [game, setGame] = useState(null);
  const event = useGameSocket(game?.gameCode);

  // Zodra er een PLAYER_JOINED event binnenkomt, bevat de payload het hele,
  // bijgewerkte Game-object (inclusief de nieuwe speler) - dat zetten we direct als onze state
  useEffect(() => {
    if (event?.type === "PLAYER_JOINED") {
      setGame(event.payload);
    }
  }, [event]);

  async function handleCreateGame() {
    const response = await fetch(`${API_BASE_URL}/games`, { method: "POST" });
    const newGame = await response.json();
    setGame(newGame);
  }

  if (!game) {
    return (
      <div className="host-page">
        <h1>Host</h1>
        <button onClick={handleCreateGame}>Nieuw spel starten</button>
      </div>
    );
  }

  return (
    <div className="host-page">
      <h1>Host</h1>
      <p className="game-code">Gamecode: {game.gameCode}</p>
      <h2>Spelers ({game.players.length})</h2>
      <ul>
        {game.players.map((player) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HostPage;