const API_BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(status) {
    super(`Request mislukt (status ${status})`);
    this.status = status;
  }
}

// Alle REST-calls lopen hier doorheen: basis-URL, JSON en foutafhandeling op één plek
export async function request(path, { method = "GET", body } = {}) {
  const hasBody = body !== undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  // next-question en answer sturen geen body terug, dus niet blind .json() aanroepen
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}