import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { QuizItem } from '@shared/interfaces/quizItem.interface';
import { QuizResult } from '@shared/interfaces/quizResult.interface';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  state$!: BehaviorSubject<QuizState>;
  private _answers!: string[][];
  private _randomQuizUrl: string = 'https://opentdb.com/api.php?amount=10';

  constructor(private http: HttpClient, private router: Router) { }

  getRandomQuiz(): void {
    this.http.get(this._randomQuizUrl).pipe(
      map((response: any) => response)).subscribe(data => {
        this._answers = this._shuffleAnswers(data.results);
        this.state$ = new BehaviorSubject<QuizState>({
          currentQuiz: data.results,
          currentAnswers: this._answers[0],
          currentQuestionIndex: 0,
          pointsPerQuestion: 100,
          quizStartTime: performance.now(),
          quizEndTime: null,
        })
        this.router.navigate(['/quiz']);
      });
  }

  getState(): QuizState {
    return this.state$.getValue();
  }

  nextQuestion(): void {
    const state = this.getState();
    const newAnswers = this._answers[state.currentQuestionIndex + 1];
    const newcurrentQuestionIndex = state.currentQuestionIndex + 1;
    this._setState({
      currentQuestionIndex: newcurrentQuestionIndex,
      currentAnswers: newAnswers
    });
  }

  previousQuestion(): void {
    const state = this.getState();
    const newAnswers = this._answers[state.currentQuestionIndex - 1];
    const newcurrentQuestionIndex = state.currentQuestionIndex - 1;
    this._setState({
      currentQuestionIndex: newcurrentQuestionIndex,
      currentAnswers: newAnswers
    });
  }

  getQuizResult(userAnswers: string[]): QuizResult {
    const state = this.getState();
    state.quizEndTime = performance.now();
    const correctAnswersCount = this._countCorrectAnswers(userAnswers, state.currentQuiz);
    const pointsCount = correctAnswersCount * state.pointsPerQuestion;
    const quizTimeCount = state.quizEndTime - state.quizStartTime;
    return {correctAnswersCount, pointsCount, quizTimeCount};
  }

  private _setState(partialState: Partial<QuizState>): void {
    this.state$.next({ ...this.state$.getValue(), ...partialState });
  }

  private _shuffleAnswers(quizData: QuizItem[]): string[][] {
    const allAnswers = [];
    for (let quiz of quizData) {
      let answers = [...quiz.incorrect_answers, quiz.correct_answer];
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
      allAnswers.push(answers);
    }
    return allAnswers
  }

  private _countCorrectAnswers(userAnswers: string[], currentQuiz: QuizItem[]): number {
    let correctAnswersCount = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] === currentQuiz[i].correct_answer) {
        correctAnswersCount++
      }
    }
    return correctAnswersCount
  }

}