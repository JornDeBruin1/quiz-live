import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useGameSocket from "../useGameSocket";
import { createGame, startNextQuestion } from "../api/gameApi";
import { describeGameError } from "../api/GameErrors";
import LogoutButton from "../components/LogoutButton";


function HostPage() {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("quizId");

  const [game, setGame] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // true zolang een vraag loopt; dan mag de host niet doorklikken
  const [questionActive, setQuestionActive] = useState(false);
  // true zolang een request onderweg is; voorkomt dubbel klikken
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const event = useGameSocket(game?.gameCode);

  useEffect(() => {
    if (!event) return;

    if (event.type === "PLAYER_JOINED" || event.type === "ANSWER_SUBMITTED") {
      setGame(event.payload);
    }

    if (event.type === "QUESTION_STARTED") {
      setCurrentQuestion(event.payload);
      setQuestionActive(true);
    }

    if (event.type === "QUESTION_ENDED") {
      setQuestionActive(false);
    }

    if (event.type === "GAME_FINISHED") {
      setCurrentQuestion(null);
      setQuestionActive(false);
    }
  }, [event]);

  // Voert een actie uit met bezig-status en foutafhandeling, zodat elke knop
  // dit niet apart hoeft te doen. Een 401 wordt al afgehandeld in client.js
  // (doorsturen naar /login), de melding hieronder is dan alleen een vangnet.
  async function runAction(action) {
    setError(null);
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setError(describeGameError(err));
    } finally {
      setBusy(false);
    }
  }

  function handleCreateGame() {
    return runAction(async () => {
      setGame(await createGame(quizId));
    });
  }

  function handleNextQuestion() {
    return runAction(() => startNextQuestion(game.gameCode));
  }

  if (!game) {
    return (
      <div className="host-page">
        <h1>Host</h1>
        {quizId ? <p>Quiz geladen, klaar om te starten.</p> : <p>Demo-quiz wordt gebruikt.</p>}
        <button onClick={handleCreateGame} disabled={busy}>
          {busy ? "Bezig..." : "Nieuw spel starten"}
        </button>
        {error && <p className="error" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="host-page">
      <h1>Host</h1>
      <LogoutButton />
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

      <button onClick={handleNextQuestion} disabled={questionActive || busy}>
        {questionActive ? "Vraag loopt..." : "Volgende vraag"}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}

export default HostPage;
