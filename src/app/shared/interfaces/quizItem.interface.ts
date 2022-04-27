export interface QuizItem {
  category: string,
  type: string,
  difficulty: string,
  question: string,
  correct_answer: string,
  incorrect_answers: string[],
  pointsPerQuestion?: number
}