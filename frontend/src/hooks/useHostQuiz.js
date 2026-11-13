import { useState, useEffect } from "react";
import { getQuiz } from "../api/quizApi";

// Laadt de quiz van de host-pagina. Zonder quizId (demo-modus) gebeurt er niets.
function useHostQuiz(quizId) {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(quizId));

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;
    getQuiz(quizId)
      .then((data) => {
        if (!cancelled) setQuiz(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Voorkomt dat een oud antwoord de state overschrijft als het quizId wisselt
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  return { quiz, error, loading };
}

export default useHostQuiz;