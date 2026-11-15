import { request, ApiError } from "./client";

// Elke functie hoort bij één operationId in api/openapi.yaml

export function createGame(quizId) {
  // Het contract eist een body; {quizId: null} geeft de demo-vragen
  return request("/games", { method: "POST", body: { quizId } });
}

export function getGame(gameCode) {
  return request(`/games/${gameCode}`);
}

export async function joinGame(gameCode, playerName) {
  try {
    return await request(`/games/${gameCode}/players`, {
      method: "POST",
      body: { name: playerName },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error("Geen spel gevonden met deze code. Controleer de code en probeer het opnieuw.");
      }
      if (error.status === 409) {
        throw new Error("Deze naam is al in gebruik in dit spel. Kies een andere naam.");
      }
      throw new Error("Kon niet meedoen. Probeer het zo opnieuw.");
    }
    throw error;
  }
}

export function startNextQuestion(gameCode) {
  return request(`/games/${gameCode}/next-question`, { method: "POST" });
}

export function submitAnswer(gameCode, playerName, answer) {
  return request(`/games/${gameCode}/answer`, {
    method: "POST",
    body: { playerName, answer },
  });
}

export function showResults(gameCode) {
  return request(`/games/${gameCode}/show-results`, { method: "POST" });
}