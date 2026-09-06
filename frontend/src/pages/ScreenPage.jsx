import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";
import Timer from "../components/Timer";

const API_BASE_URL = "http://localhost:8080/api";

function ScreenPage() {
  const { gameCode } = useParams();
  const [game, setGame] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionResult, setQuestionResult] = useState(null);
  const event = useGameSocket(gameCode);

  // Bij openen: huidige staat ophalen
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
    if (!event) return;

    if (event.type === "PLAYER_JOINED" || event.type === "ANSWER_SUBMITTED") {
      setGame(event.payload);
    }

    if (event.type === "QUESTION_STARTED") {
      setCurrentQuestion(event.payload);
      setQuestionResult(null);
    }

    if (event.type === "QUESTION_ENDED") {
      setQuestionResult(event.payload);
    }

    if (event.type === "GAME_FINISHED") {
      setCurrentQuestion(null);
      setQuestionResult(null);
    }
  }, [event]);

  if (!game) {
    return <p>Spel niet gevonden voor gamecode {gameCode}</p>;
  }

  if (!currentQuestion) {
    return (
      <div className="screen-page">
        <h1>PubQuiz</h1>
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

  if (questionResult) {
    return (
      <div className="screen-page">
        <h2>Correct antwoord:</h2>
        <p className="correct-answer">{questionResult.correctAnswer}</p>
        <h3>Stand:</h3>
        <ol>
          {questionResult.leaderboard
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((player) => (
              <li key={player.name}>
                {player.name} — {player.score} punten
              </li>
            ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="screen-page">
      <Timer deadline={currentQuestion.deadline} />
      <h2>{currentQuestion.text}</h2>
      <ul className="answer-list">
        {currentQuestion.answers.map((answer) => (
          <li key={answer}>{answer}</li>
        ))}
      </ul>
    </div>
  );
}

export default ScreenPage;