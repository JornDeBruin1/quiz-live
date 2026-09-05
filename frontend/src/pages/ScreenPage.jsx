import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";

const API_BASE_URL = "http://localhost:8080/api";

function ScreenPage() {
  const { gameCode } = useParams();
  const [game, setGame] = useState(null);
  const event = useGameSocket(gameCode);

  // Bij het openen van de pagina de huidige staat ophalen via REST -
  // WebSocket geeft je alleen nieuwe events vanaf nu, niet wat er al gebeurd was
  useEffect(() => {
    async function fetchGame() {
      const response = await fetch(`${API_BASE_URL}/games/${gameCode}`);
      if (response.ok) {
        setGame(await response.json());
      }
    }
    fetchGame();
  }, [gameCode]);

  useEffect(() => {
    if (event?.type === "PLAYER_JOINED") {
      setGame(event.payload);
    }
  }, [event]);

  if (!game) {
    return (
      <div className="screen-page">
        <h1>Screen</h1>
        <p>Spel niet gevonden voor gamecode {gameCode}</p>
      </div>
    );
  }

  return (
    <div className="screen-page">
      <h1>Screen</h1>
      <p>Gamecode: {gameCode}</p>
      <h2>Spelers ({game.players.length})</h2>
      <ul>
        {game.players.map((player) => (
          <li key={player.name}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ScreenPage;