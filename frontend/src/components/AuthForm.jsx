import { useState } from "react";
import { authErrorMessage } from "../pages/authErrors";

export default function AuthForm({ title, submitLabel, passwordAutoComplete, onSubmit, footer }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(authErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)}
             placeholder="Gebruikersnaam" autoComplete="username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
             placeholder="Wachtwoord" autoComplete={passwordAutoComplete} />
      <button type="submit">{submitLabel}</button>
      {error && <p>{error}</p>}
      {footer}
    </form>
  );
}