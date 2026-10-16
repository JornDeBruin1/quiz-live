import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";
import useGame from "./useGame";

function useScreenState(gameCode) {
  const { game, setGame, error } = useGame(gameCode);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionResult, setQuestionResult] = useState(null);
  const event = useGameSocket(gameCode);

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
  }, [event, setGame]);

  return { game, error, currentQuestion, questionResult };
}

export default useScreenState;