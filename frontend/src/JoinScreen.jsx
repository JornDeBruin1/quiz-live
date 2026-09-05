import { useState } from "react";
import { joinGame } from "./api";

function JoinScreen({ onJoined }) {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const player = await joinGame(gameCode, playerName);
      onJoined(player, gameCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="join-screen">
      <h1>PubQuiz</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Gamecode"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Jouw naam"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Bezig..." : "Join"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default JoinScreen;