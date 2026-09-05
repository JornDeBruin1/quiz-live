import { useState } from "react";
import JoinScreen from "./JoinScreen";
import Quiz from "./Quiz";
import "./App.css";

function App() {
  const [player, setPlayer] = useState(null);

  return (
    <div className="app">
      {player ? <Quiz /> : <JoinScreen onJoined={setPlayer} />}
    </div>
  );
}

export default App;