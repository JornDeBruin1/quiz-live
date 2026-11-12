import { Link, Navigate } from "react-router-dom";
import { useMyQuizzes } from "../hooks/useMyQuizzes";
import QuizList from "../components/QuizList";
import LogoutButton from "../components/LogoutButton";

export default function MyQuizzesPage() {
  const { quizzes, loading, error } = useMyQuizzes();

  // Verlopen token: de client heeft het al gewist, dus terug naar inloggen
  if (error?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>Mijn quizzen</h1>
      <Link to="/quiz-editor">Nieuwe quiz maken</Link> <LogoutButton />
      {loading && <p>Laden...</p>}
      {error && error.status !== 401 && <p>Kon de quizzen niet laden.</p>}
      {!loading && !error && <QuizList quizzes={quizzes} />}
    </div>
  );
}