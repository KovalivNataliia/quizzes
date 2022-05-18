import { QuizData } from "@shared/interfaces/quizData.interface";

export interface QuizResData {
  message: string,
  quizzes: QuizData[],
  userQuizzes: QuizData[],
  quiz: QuizData
}