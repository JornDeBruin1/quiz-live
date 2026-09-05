import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <h1>PubQuiz</h1>
      <nav>
        <Link to="/host">Host</Link>
        <Link to="/screen/908528">Screen (test)</Link>
        <Link to="/player">Player</Link>
      </nav>
    </div>
  );
}

export default HomePage;