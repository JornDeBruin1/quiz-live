import usePlayerGame from "../hooks/usePlayerGame";
import PlayerFinishedView from "../components/PlayerFinishedView";
import PlayerResultView from "../components/PlayerResultView";
import PlayerAnsweredView from "../components/PlayerAnsweredView";
import PlayerQuestionView from "../components/PlayerQuestionView";

function PlayerGame({ gameCode, playerName }) {
  const {
    currentQuestion,
    selectedAnswer,
    questionResult,
    gameFinished,
    answerFailed,
    answeringClosed,
    handleAnswer,
  } = usePlayerGame(gameCode, playerName);

  if (gameFinished) {
    return <PlayerFinishedView playerName={playerName} />;
  }

  if (!currentQuestion) {
    return (
      <div className="player-game">
        <p>Wachten tot de host de quiz start...</p>
      </div>
    );
  }

  if (questionResult) {
    return (
      <PlayerResultView
        questionResult={questionResult}
        selectedAnswer={selectedAnswer}
        playerName={playerName}
      />
    );
  }

  if (selectedAnswer) {
    return (
      <PlayerAnsweredView
        deadline={currentQuestion.deadline}
        answerFailed={answerFailed}
      />
    );
  }

  if (answeringClosed) {
    return (
      <div className="player-game">
        <p role="status">Antwoorden gesloten.</p>
        <p className="muted">Wachten op de resultaten...</p>
      </div>
    );
  }

  return (
    <PlayerQuestionView
      currentQuestion={currentQuestion}
      onAnswer={handleAnswer}
    />
  );
}

export default PlayerGame;