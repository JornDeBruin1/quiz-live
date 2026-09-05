const API_BASE_URL = "http://localhost:8080/api";

export async function joinGame(gameCode, playerName) {
  const response = await fetch(`${API_BASE_URL}/games/${gameCode}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: playerName }),
  });

  if (!response.ok) {
    throw new Error("Kon niet joinen. Klopt de gamecode?");
  }

  return response.json();
}