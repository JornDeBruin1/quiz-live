import Timer from "./Timer";

// Zodra er geantwoord is, tonen we de vraag niet meer enkel een wachtscherm
function PlayerAnsweredView({ deadline, answerFailed }) {
  return (
    <div className="player-game">
      <Timer deadline={deadline} />
      {answerFailed ? (
        <p className="error" role="alert">Je antwoord is niet geteld.</p>
      ) : (
        <>
          <h2>Antwoord verstuurd!</h2>
          <p className="muted">Wachten op de andere spelers...</p>
        </>
      )}
    </div>
  );
}

export default PlayerAnsweredView;