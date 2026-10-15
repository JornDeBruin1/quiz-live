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
    // Zelfde melding als in de oude api.js; netwerkfouten laten we ongemoeid
    if (error instanceof ApiError) {
      throw new Error("Kon niet joinen. Klopt de gamecode?");
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