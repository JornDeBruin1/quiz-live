import { Link } from "react-router-dom";

export default function QuizListItem({ quiz }) {
  const title = quiz.title?.trim() || "(zonder titel)";
  const count = quiz.questions.length;

  return (
    <li>
      <strong>{title}</strong> · {count} {count === 1 ? "vraag" : "vragen"}{" "}
      <Link to={`/host?quizId=${quiz.id}`}>Spel starten</Link>
    </li>
  );
}