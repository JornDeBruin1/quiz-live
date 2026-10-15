import { useEffect, useState } from "react";
import { getGame } from "../api/gameApi";

// Haalt de beginstand van een spel op zodra de component verschijnt
// of de gamecode verandert. Live updates komen apart via useGameSocket.
function useGame(gameCode) {
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Voorkomt dat een oud antwoord nog state zet nadat de component
    // weg is of de gamecode al veranderd is
    let cancelled = false;

    getGame(gameCode)
      .then((data) => {
        if (!cancelled) setGame(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [gameCode]);

  return { game, setGame, error };
}

export default useGame;