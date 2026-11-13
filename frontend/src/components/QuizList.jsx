import QuizListItem from "./QuizListItem";

export default function QuizList({ quizzes }) {
  if (quizzes.length === 0) {
    return <p>Je hebt nog geen quizzen.</p>;
  }
  return (
    <ul className="quiz-list">
      {quizzes.map((quiz) => (
        <QuizListItem key={quiz.id} quiz={quiz} />
      ))}
    </ul>
  );
}