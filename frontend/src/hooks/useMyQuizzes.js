import { useEffect, useState } from "react";
import { listMyQuizzes } from "../api/quizApi";

export function useMyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listMyQuizzes()
      .then((data) => { if (!cancelled) setQuizzes(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { quizzes, loading, error };
}