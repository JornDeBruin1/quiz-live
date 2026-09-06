import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HostPage from "./pages/HostPage";
import ScreenPage from "./pages/ScreenPage";
import PlayerPage from "./pages/PlayerPage";
import QuizEditorPage from "./pages/QuizEditorPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/quiz-editor" element={<QuizEditorPage />} />
          <Route path="/screen/:gameCode" element={<ScreenPage />} />
          <Route path="/player" element={<PlayerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;