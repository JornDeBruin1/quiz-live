import { useParams } from "react-router-dom";
import useScreenState from "../hooks/useScreenState";
import LobbyView from "../components/LobbyView";
import QuestionView from "../components/QuestionView";
import ResultView from "../components/ResultView";
import FinalStandingsView from "../components/FinalStandingsView";

function ScreenPage() {
  const { gameCode } = useParams();
  const { game, error, currentQuestion, questionResult, finalStandings } =
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

  if (finalStandings) {
    return <FinalStandingsView standings={finalStandings} />;
  }

  if (!currentQuestion) {
    return <LobbyView gameCode={gameCode} players={game.players} />;
  }

  return <QuestionView currentQuestion={currentQuestion} />;
}

export default ScreenPage;