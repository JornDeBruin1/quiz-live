import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";
import Timer from "../components/Timer";


const API_BASE_URL = "http://localhost:8080/api";

function PlayerGame({ gameCode, playerName }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionResult, setQuestionResult] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const event = useGameSocket(gameCode);

  useEffect(() => {
    if (!event) return;

    if (event.type === "QUESTION_STARTED") {
      setCurrentQuestion(event.payload);
      setSelectedAnswer(null);
      setQuestionResult(null);
    }

    if (event.type === "QUESTION_ENDED") {
      setQuestionResult(event.payload);
    }

    if (event.type === "GAME_FINISHED") {
      setGameFinished(true);
    }
  }, [event]);

  async function handleAnswer(answer) {
    if (selectedAnswer || questionResult) return;

    setSelectedAnswer(answer);

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
        <p>Bedankt voor het meespelen, {playerName}!</p>
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

  if (questionResult) {
    const wasCorrect = selectedAnswer === questionResult.correctAnswer;
    const me = questionResult.leaderboard.find((p) => p.name === playerName);

    return (
      <div className="player-game">
        <p>Correct antwoord: {questionResult.correctAnswer}</p>
        <p>{wasCorrect ? "✅ Goed!" : "❌ Fout"}</p>
        {me && <p>Jouw totaalscore: {me.score} punten</p>}
        <p>Wachten op de volgende vraag...</p>
      </div>
    );
  }

  // Zodra er geantwoord is, tonen we de vraag niet meer -
  // enkel een wachtscherm, zoals bij Kahoot
  if (selectedAnswer) {
    return (
      <div className="player-game">
        <Timer deadline={currentQuestion.deadline} />
        <p>Antwoord verstuurd!</p>
        <p>Wachten op de andere spelers...</p>
      </div>
    );
  }

  return (
    <div className="player-game">
      <Timer deadline={currentQuestion.deadline} />
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