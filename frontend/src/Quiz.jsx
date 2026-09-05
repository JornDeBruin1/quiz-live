import { useState } from "react";
import Question from "./Question";
import questions from "./questions";

function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  function handleAnswered(isCorrect) {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setQuizFinished(true);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
  }

  if (quizFinished) {
    return (
      <div className="quiz-finished">
        <h1>Quiz afgelopen!</h1>
        <p>
          Je score: {score} / {questions.length}
        </p>
        <button onClick={handleRestart}>Opnieuw spelen</button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="progress">
        Vraag {currentIndex + 1} van {questions.length}
      </p>
      <Question
        key={currentIndex}
        question={questions[currentIndex]}
        onAnswered={handleAnswered}
      />
      <button onClick={handleNext}>Volgende vraag</button>
    </div>
  );
}

export default Quiz;