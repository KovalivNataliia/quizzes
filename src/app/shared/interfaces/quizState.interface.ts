import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizState {
  currentQuiz: QuizItem[],
  currentAnswers: string[],
  currentQuestionIndex: number
}