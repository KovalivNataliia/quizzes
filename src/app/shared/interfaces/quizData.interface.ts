import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizData {
  quizName: string,
  pointsPerQuestion: number,
  timesPlayed: number,
  createdByUser: boolean,
  quiz: QuizItem[]
}