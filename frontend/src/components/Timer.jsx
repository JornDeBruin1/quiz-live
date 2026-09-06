import { useState, useEffect } from "react";

// Ontvangt een deadline in milliseconden (van de server) en toont een aftellende timer
function Timer({ deadline }) {
  const [secondsLeft, setSecondsLeft] = useState(calculateSeconds(deadline));

  function calculateSeconds(deadline) {
    // Bereken hoeveel seconden er nog over zijn op basis van de server-deadline
    return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateSeconds(deadline);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 500); // Elke halve seconde checken zodat de timer soepel aanvoelt

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="timer">
      <span className={secondsLeft <= 5 ? "timer-warning" : ""}>
        {secondsLeft}
      </span>
    </div>
  );
}

export default Timer;