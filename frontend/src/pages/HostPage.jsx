import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useGameSocket from "../useGameSocket";
import { createGame, startNextQuestion } from "../api/gameApi";


function HostPage() {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("quizId");

  const [game, setGame] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const event = useGameSocket(game?.gameCode);

  useEffect(() => {
    if (!event) return;

    if (event.type === "PLAYER_JOINED" || event.type === "ANSWER_SUBMITTED") {
      setGame(event.payload);
    }

    if (event.type === "QUESTION_STARTED") {
      setCurrentQuestion(event.payload);
    }

    if (event.type === "GAME_FINISHED") {
      setCurrentQuestion(null);
    }
  }, [event]);

  async function handleCreateGame() {
    const newGame = await createGame(quizId);
    setGame(newGame);
  }

  async function handleNextQuestion() {
    await startNextQuestion(game.gameCode);
  }

  if (!game) {
    return (
      <div className="host-page">
        <h1>Host</h1>
        {quizId ? <p>Quiz geladen, klaar om te starten.</p> : <p>Demo-quiz wordt gebruikt.</p>}
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
          <li key={player.name}>
            {player.name} — {player.score} punten
          </li>
        ))}
      </ul>

      {currentQuestion && (
        <div className="current-question">
          <h3>Actieve vraag:</h3>
          <p>{currentQuestion.text}</p>
        </div>
      )}

      <button onClick={handleNextQuestion}>Volgende vraag</button>
    </div>
  );
}

export default HostPage;