import { useState, useEffect } from "react";
import { getInitialTheme, applyTheme, saveTheme } from "../theme";

function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
  }

  return { theme, toggleTheme };
}

export default useTheme;