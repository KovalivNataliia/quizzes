export interface UserStatisticData {
  [key: string]: {
    quizzesCount: number,
    questionsCount: number,
    averagePointsValue: number,
    averageTime: number
  };
}