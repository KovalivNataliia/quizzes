import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizData {
  id: number,
  quizName: string,
  pointsPerQuestion: number,
  timesPlayed: number,
  createdByUser: boolean,
  quiz: QuizItem[]
}