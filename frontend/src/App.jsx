import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HostPage from "./pages/HostPage";
import ScreenPage from "./pages/ScreenPage";
import PlayerPage from "./pages/PlayerPage";
import QuizEditorPage from "./pages/QuizEditorPage";
import Login from "./pages/Login";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyQuizzesPage from "./pages/MyQuizzesPage";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<ProtectedRoute><HostPage /></ProtectedRoute>} />
          <Route path="/quiz-editor" element={<ProtectedRoute><QuizEditorPage /></ProtectedRoute>} />
          <Route path="/screen/:gameCode" element={<ScreenPage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-quizzes" element={<ProtectedRoute><MyQuizzesPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;