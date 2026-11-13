import { Link, Navigate } from "react-router-dom";
import { useMyQuizzes } from "../hooks/useMyQuizzes";
import QuizList from "../components/QuizList";

export default function MyQuizzesPage() {
  const { quizzes, loading, error } = useMyQuizzes();

  // Verlopen token: de client heeft het al gewist, dus terug naar inloggen
  if (error?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="my-quizzes-page">
      <h1>Mijn quizzen</h1>
      <Link to="/quiz-editor" className="button-link">Nieuwe quiz maken</Link>
      {loading && <p>Laden...</p>}
      {error && error.status !== 401 && (
        <p className="error" role="alert">Kon de quizzen niet laden.</p>
      )}
      {!loading && !error && <QuizList quizzes={quizzes} />}
    </div>
  );
}