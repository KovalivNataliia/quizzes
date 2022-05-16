import { QuizItem } from '@shared/interfaces/quizItem.interface';

export interface QuizState {
  currentQuiz: QuizItem[],
  currentQuizId?: string,
  currentAnswers: string[],
  currentQuestionIndex: number,
  pointsPerQuestion: number,
  quizStartTime: number,
  quizEndTime: number | null,
  isQuizDataSaved: boolean
}