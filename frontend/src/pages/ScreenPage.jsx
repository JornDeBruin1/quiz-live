import { useParams } from "react-router-dom";

function ScreenPage() {
  const { gameCode } = useParams();

  return (
    <div className="screen-page">
      <h1>Screen</h1>
      <p>Gamecode: {gameCode}</p>
      <p>Hier komt straks de vraag, timer en het leaderboard.</p>
    </div>
  );
}

export default ScreenPage;