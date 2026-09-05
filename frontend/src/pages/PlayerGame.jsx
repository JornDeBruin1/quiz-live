import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";

const API_BASE_URL = "http://localhost:8080/api";

function PlayerGame({ gameCode, playerName }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const event = useGameSocket(gameCode);

  useEffect(() => {
    if (!event) return;

    if (event.type === "QUESTION_STARTED") {
      setCurrentQuestion(event.payload);
      setSelectedAnswer(null);
      setWaitingForNext(false);
    }

    if (event.type === "GAME_FINISHED") {
      setGameFinished(true);
    }
  }, [event]);

  async function handleAnswer(answer) {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setWaitingForNext(true);

    await fetch(`${API_BASE_URL}/games/${gameCode}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, answer }),
    });
  }

  if (gameFinished) {
    return (
      <div className="player-game">
        <h1>Quiz afgelopen!</h1>
        <p>Bedankt voor het meespelen, {playerName}.</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="player-game">
        <p>Wachten tot de host de quiz start...</p>
      </div>
    );
  }

  if (waitingForNext) {
    return (
      <div className="player-game">
        <p>Antwoord verstuurd! Wachten op de volgende vraag...</p>
      </div>
    );
  }

  return (
    <div className="player-game">
      <h2>{currentQuestion.text}</h2>
      <div className="answers">
        {currentQuestion.answers.map((answer) => (
          <button key={answer} onClick={() => handleAnswer(answer)}>
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlayerGame;