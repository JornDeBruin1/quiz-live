import { useState, useEffect } from "react";
import useGameSocket from "../useGameSocket";
import { submitAnswer } from "../api/gameApi";

function usePlayerGame(gameCode, playerName) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionResult, setQuestionResult] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [answerFailed, setAnswerFailed] = useState(false);
  const [answeringClosed, setAnsweringClosed] = useState(false);
  const [finalStandings, setFinalStandings] = useState(null);
  const event = useGameSocket(gameCode);

  useEffect(() => {
    if (!event) return;

    if (event.type === "QUESTION_STARTED") {
      setCurrentQuestion(event.payload);
      setSelectedAnswer(null);
      setQuestionResult(null);
      setAnsweringClosed(false);
    }

    if (event.type === "ANSWERING_CLOSED") {
      setAnsweringClosed(true);
    }

    if (event.type === "QUESTION_ENDED") {
      setQuestionResult(event.payload);
    }

    if (event.type === "GAME_FINISHED") {
      setFinalStandings(event.payload);
      setGameFinished(true);
    }
  }, [event]);

  async function handleAnswer(answer) {
    if (selectedAnswer || questionResult || answeringClosed) return;

    setSelectedAnswer(answer);
    setAnswerFailed(false);

    try {
      await submitAnswer(gameCode, playerName, answer);
    } catch (error) {
      // De server weigert bijvoorbeeld een antwoord na de deadline,
      // of de verbinding is weg. Zo weet de speler dat het niet telde.
      console.error("Antwoord versturen mislukt:", error);
      setAnswerFailed(true);
    }
  }

  return {
    currentQuestion,
    selectedAnswer,
    questionResult,
    gameFinished,
    answerFailed,
    answeringClosed,
    finalStandings,
    handleAnswer,
  };
}

export default usePlayerGame;