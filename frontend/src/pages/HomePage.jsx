import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <h1>PubQuiz</h1>
      <nav>
        <Link to="/host">Host</Link>
        <Link to="/quiz-editor">Quiz maken</Link>
        <Link to="/screen/908528">Screen (test)</Link>
        <Link to="/player">Player</Link>
        <Link to="/my-quizzes">Mijn quizzen</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}

export default HomePage;