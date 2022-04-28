import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizState {
  currentQuiz: QuizItem[],
  answers: string[],
  currentQuestionIndex: number
}