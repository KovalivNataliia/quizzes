import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizData {
  _id: string,
  quizName: string,
  pointsPerQuestion: number,
  timesPlayed: number,
  createdByUser: boolean,
  quiz: QuizItem[]
}