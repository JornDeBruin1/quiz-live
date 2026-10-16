import { useParams } from "react-router-dom";
import useScreenState from "../hooks/useScreenState";
import LobbyView from "../components/LobbyView";
import QuestionView from "../components/QuestionView";
import ResultView from "../components/ResultView";

function ScreenPage() {
  const { gameCode } = useParams();
  const { game, error, currentQuestion, questionResult } =
    useScreenState(gameCode);

  if (error) {
    return <p>Spel niet gevonden voor gamecode {gameCode}</p>;
  }

  if (!game) {
    return <p>Laden...</p>;
  }

  if (!currentQuestion) {
    return <LobbyView gameCode={gameCode} players={game.players} />;
  }

  if (questionResult) {
    return <ResultView questionResult={questionResult} />;
  }

  return <QuestionView currentQuestion={currentQuestion} />;
}

export default ScreenPage;