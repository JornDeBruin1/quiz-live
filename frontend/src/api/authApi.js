import { request } from "./client";

export function register(username, password) {
  return request("/auth/register", { method: "POST", body: { username, password } });
}

export function login(username, password) {
  return request("/auth/login", { method: "POST", body: { username, password } });
}

export function listMyQuizzes() {
  return request("/quizzes");
}