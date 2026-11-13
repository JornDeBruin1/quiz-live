import { Link, NavLink, useLocation } from "react-router-dom";
import { isSignedIn } from "../api/session";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";

export default function AppHeader() {
  // useLocation laat de header bij elke navigatie opnieuw renderen,
  // zodat isSignedIn() na inloggen en uitloggen weer klopt.
  const { pathname } = useLocation();

  // Het grote scherm (beamer) heeft geen header
  if (pathname.startsWith("/screen")) return null;

  // Spelers: alleen de thema-knop. Een tik op een link haalt ze uit het spel.
  if (pathname.startsWith("/player")) {
    return (
      <header className="app-header">
        <div className="actions">
          <ThemeToggle />
        </div>
      </header>
    );
  }

  const signedIn = isSignedIn();

  return (
    <header className="app-header">
      <Link to="/" className="brand">PubQuiz</Link>
      {signedIn && (
        <nav>
          <NavLink to="/host">Host</NavLink>
          <NavLink to="/quiz-editor">Quiz maken</NavLink>
          <NavLink to="/my-quizzes">Mijn quizzen</NavLink>
        </nav>
      )}
      <div className="actions">
        <ThemeToggle />
        {signedIn && <LogoutButton />}
      </div>
    </header>
  );
}