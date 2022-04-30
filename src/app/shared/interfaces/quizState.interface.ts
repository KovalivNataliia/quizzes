import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizState {
  currentQuiz: QuizItem[],
  currentAnswers: string[],
  currentQuestionIndex: number,
  pointsPerQuestion: number,
  quizStartTime: number,
  quizEndTime: number | null
}