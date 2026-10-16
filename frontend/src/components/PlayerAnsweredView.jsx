import Timer from "./Timer";

// Zodra er geantwoord is, tonen we de vraag niet meer enkel een wachtscherm
function PlayerAnsweredView({ deadline, answerFailed }) {
  return (
    <div className="player-game">
      <Timer deadline={deadline} />
      {answerFailed ? (
        <p>Je antwoord is niet geteld.</p>
      ) : (
        <>
          <p>Antwoord verstuurd!</p>
          <p>Wachten op de andere spelers...</p>
        </>
      )}
    </div>
  );
}

export default PlayerAnsweredView;