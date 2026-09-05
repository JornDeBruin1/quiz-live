import { useState } from "react";
import JoinScreen from "../JoinScreen";
import Quiz from "../Quiz";

function PlayerPage() {
  const [player, setPlayer] = useState(null);

  return (
    <div className="player-page">
      {player ? <Quiz /> : <JoinScreen onJoined={setPlayer} />}
    </div>
  );
}

export default PlayerPage;