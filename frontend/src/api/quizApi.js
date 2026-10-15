import { request } from "./client";

export function createQuiz(title) {
  return request("/quizzes", { method: "POST", body: { title } });
}

export function addQuestion(quizId, { text, answers, correctAnswer }) {
  return request(`/quizzes/${quizId}/questions`, {
    method: "POST",
    body: { text, answers, correctAnswer },
  });
}