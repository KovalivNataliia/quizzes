import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { QuizItem } from '@shared/interfaces/quizItem.interface';
import { QuizResult } from '@shared/interfaces/quizResult.interface';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { QUIZZES } from '@shared/quizzes-data';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  public state$!: BehaviorSubject<QuizState>;
  public answers!: string[][];
  private _quizzes = QUIZZES;
  private _randomQuizUrl: string = 'https://opentdb.com/api.php?amount=10';

  constructor(private http: HttpClient) { }

  public getQuizzes(): QuizData[] {
    return this._quizzes;
  }

  public getRandomQuiz(): Observable<QuizItem[]> {
    return this.http.get(this._randomQuizUrl).pipe(map((response: any) => response.results));
  }

  public getState(): QuizState {
    return this.state$.getValue();
  }

  public setState(stateData: QuizState): void {
    this.state$ = new BehaviorSubject<QuizState>(stateData);
  }

  public nextQuestion(): void {
    const state = this.getState();
    const newAnswers = this.answers[state.currentQuestionIndex + 1];
    const newcurrentQuestionIndex = state.currentQuestionIndex + 1;
    this._setPartialState({
      currentQuestionIndex: newcurrentQuestionIndex,
      currentAnswers: newAnswers
    });
  }

  public previousQuestion(): void {
    const state = this.getState();
    const newAnswers = this.answers[state.currentQuestionIndex - 1];
    const newcurrentQuestionIndex = state.currentQuestionIndex - 1;
    this._setPartialState({
      currentQuestionIndex: newcurrentQuestionIndex,
      currentAnswers: newAnswers
    });
  }

  public getQuizResult(userAnswers: string[]): QuizResult {
    const state = this.getState();
    state.quizEndTime = performance.now();
    const correctAnswersCount = this._countCorrectAnswers(userAnswers, state.currentQuiz);
    const pointsCount = correctAnswersCount * state.pointsPerQuestion;
    const quizTimeCount = state.quizEndTime - state.quizStartTime;
    this._changeTimesPlayedData(state.currentQuiz);
    this._setPartialState({
      isQuizDataSaved: true
    });
    return { correctAnswersCount, pointsCount, quizTimeCount };
  }

  public shuffleAnswers(quizData: QuizItem[]): string[][] {
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

  public searchQuiz(text: string): QuizData[] {
    const filteredQuizzes = this._quizzes.filter(quizData => {
      text = text.toLocaleLowerCase();
      return quizData.quizName.toLocaleLowerCase().includes(text);
    });
    return filteredQuizzes;
  }

  public sortQuizzes(selectedValue: string): QuizData[] {
    const quizzes = [...this._quizzes];
    switch (selectedValue) {
      case 'name':
        return quizzes.sort((a, b) => b.quizName > a.quizName ? -1 : 1);
      case 'points':
        return quizzes.sort((a, b) => b.pointsPerQuestion - a.pointsPerQuestion);
      case 'questions':
        return quizzes.sort((a, b) => b.quiz.length - a.quiz.length);
      case 'playedTimes':
        return quizzes.sort((a, b) => b.timesPlayed - a.timesPlayed);
      default:
        return this._quizzes
    }
  }

  private _setPartialState(partialState: Partial<QuizState>): void {
    this.state$.next({ ...this.state$.getValue(), ...partialState });
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

  private _changeTimesPlayedData(quiz: QuizItem[]): void {
    this._quizzes.map(quizData => {
      if (quizData.quiz.every(el => quiz.includes(el))) {
        quizData.timesPlayed++
      }
    });
  }

}