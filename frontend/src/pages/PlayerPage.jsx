import { useState } from "react";
import JoinScreen from "../JoinScreen";
import PlayerGame from "./PlayerGame";

function PlayerPage() {
  const [player, setPlayer] = useState(null);
  const [gameCode, setGameCode] = useState(null);

  function handleJoined(joinedPlayer, joinedGameCode) {
    setPlayer(joinedPlayer);
    setGameCode(joinedGameCode);
  }

  return (
    <div className="player-page">
      {player ? (
        <PlayerGame gameCode={gameCode} playerName={player.name} />
      ) : (
        <JoinScreen onJoined={handleJoined} />
      )}
    </div>
  );
}

export default PlayerPage;