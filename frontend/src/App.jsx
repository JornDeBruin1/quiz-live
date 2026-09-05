import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HostPage from "./pages/HostPage";
import ScreenPage from "./pages/ScreenPage";
import PlayerPage from "./pages/PlayerPage";
import WebSocketTest from "./pages/WebSocketTest";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/screen/:gameCode" element={<ScreenPage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/wstest" element={<WebSocketTest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;