import { getToken } from "./token";

const API_BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(status) {
    super(`Request mislukt (status ${status})`);
    this.status = status;
  }
}

let unauthorizedHandler = () => {};

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function request(path, { method = "GET", body } = {}) {
  const hasBody = body !== undefined;
  const token = getToken();

  const headers = {};
  if (hasBody) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Verlopen of ongeldig token: de handler beslist wat ermee gebeurt.
    // Een mislukte login (ook 401) telt niet mee.
    if (response.status === 401 && token && !path.startsWith("/auth/")) {
      unauthorizedHandler();
    }
    throw new ApiError(response.status);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}