import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizData {
  response_code: number,
  results: QuizItem[],
}