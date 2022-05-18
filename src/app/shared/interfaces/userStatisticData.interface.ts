export interface UserStatisticData {
  [key: string]: {
    quizzesCount: number,
    questionsCount: number,
    pointsCount: number,
    quizTimeCount: number
  };
}