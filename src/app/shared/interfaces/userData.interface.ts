import { QuizItem } from "@shared/interfaces/quizItem.interface";

export interface UserData {
  statistic: {
    [key: string]: {
      quizzesCount: number,
      questionsCount: number,
      averagePointsValue: number,
      averageTime: number
    };
  },
  quizzes: QuizItem[];
}