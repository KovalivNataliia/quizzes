import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { QuizItem } from '@shared/interfaces/quizItem.interface';
import { QuizResult } from '@shared/interfaces/quizResult.interface';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { QuizCategory } from '@shared/interfaces/quizCategory.interface';
import { QUIZZES } from '@shared/quizzes-data';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  public answers!: string[][];
  private _state$!: BehaviorSubject<QuizState>;
  private _quizzes = QUIZZES;
  private _userQuizzes!: QuizData[];
  private _userTimesPlayedData!: { [key: string]: number };
  private _randomQuizUrl: string = 'https://opentdb.com/api.php?amount=10';
  private _quizCategoriesUrl: string = 'https://opentdb.com/api_category.php';
  private _questionCountUrl: string = 'https://opentdb.com/api_count.php?category=';

  constructor(private http: HttpClient) {
    this._userQuizzes = JSON.parse(localStorage.getItem('userQuizzes')!) || [];
    this._userTimesPlayedData = JSON.parse(localStorage.getItem('userTimesPlayedData')!) || {};
    this._quizzes = [...this._quizzes, ...this._userQuizzes];
    this._quizzes.map(quiz => quiz.timesPlayed = this._userTimesPlayedData[quiz.id] || 0)
  }

  public getQuizzes(): QuizData[] {
    return this._quizzes;
  }

  public getState(): BehaviorSubject<QuizState> {
    return this._state$;
  }

  public getStateValue(): QuizState {
    return this._state$.getValue();
  }

  public setState(stateData: QuizState): void {
    this._state$ = new BehaviorSubject<QuizState>(stateData);
  }
  
  public getRandomQuiz(): Observable<QuizItem[]> {
    return this.http.get(this._randomQuizUrl).pipe(map((response: any) => response.results));
  }

  public getQuiz(quizRequestData: CreateQuizData): Observable<QuizItem[]> {
    const { questionCount, categoryId, quizDifficulty } = quizRequestData;
    const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${categoryId}&difficulty=${quizDifficulty}`;
    return this.http.get(url).pipe(map((response: any) => response.results));
  }

  public getQuizCategories(): Observable<QuizCategory[]> {
    return this.http.get(this._quizCategoriesUrl).pipe(map((response: any) => response.trivia_categories));
  }

  public getQuestionCount(id: string): Observable<{ [key: string]: number }> {
    return this.http.get(this._questionCountUrl + id).pipe(map((response: any) => response.category_question_count));
  }

  public nextQuestion(): void {
    const state = this.getStateValue();
    const newAnswers = this.answers[state.currentQuestionIndex + 1];
    const newcurrentQuestionIndex = state.currentQuestionIndex + 1;
    this._setPartialState({
      currentQuestionIndex: newcurrentQuestionIndex,
      currentAnswers: newAnswers
    });
  }

  public previousQuestion(): void {
    const state = this.getStateValue();
    const newAnswers = this.answers[state.currentQuestionIndex - 1];
    const newcurrentQuestionIndex = state.currentQuestionIndex - 1;
    this._setPartialState({
      currentQuestionIndex: newcurrentQuestionIndex,
      currentAnswers: newAnswers
    });
  }

  public getQuizResult(userAnswers: string[]): QuizResult {
    const state = this.getStateValue();
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
      const answers = [...quiz.incorrect_answers, quiz.correct_answer];
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
      allAnswers.push(answers);
    }
    return allAnswers;
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

  public createQuiz(quiz: QuizItem[], pointsPerQuestion: string): void {
    const lastQuiz = this._quizzes[this._quizzes.length - 1];
    const quizData = {
      id: lastQuiz.id + 1,
      quizName: quiz[0].category,
      pointsPerQuestion: +pointsPerQuestion,
      timesPlayed: 0,
      createdByUser: true,
      quiz
    }
    this._userQuizzes = [...this._userQuizzes, quizData]
    this._saveUserQuizzes();
    this._quizzes = [...this._quizzes, quizData];
  }

  public removeQuiz(quizId: number): void {
    this._userQuizzes = this._userQuizzes.filter(quiz => quiz.id !== quizId);
    this._quizzes = this._quizzes.filter(quiz => quiz.id !== quizId);
    this._saveUserQuizzes();
    if (this._userTimesPlayedData[quizId]) {
      delete this._userTimesPlayedData[quizId];
      this._saveUserTimesPlayedData();
    }
  }

  private _saveUserQuizzes(): void {
    localStorage.setItem('userQuizzes', JSON.stringify(this._userQuizzes));
  }

  private _saveUserTimesPlayedData(): void {
    localStorage.setItem('userTimesPlayedData', JSON.stringify(this._userTimesPlayedData));
  }

  private _setPartialState(partialState: Partial<QuizState>): void {
    this._state$.next({ ...this.getStateValue(), ...partialState });
  }

  private _countCorrectAnswers(userAnswers: string[], currentQuiz: QuizItem[]): number {
    let correctAnswersCount = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] === currentQuiz[i].correct_answer) {
        correctAnswersCount++;
      }
    }
    return correctAnswersCount;
  }

  private _changeTimesPlayedData(quiz: QuizItem[]): void {
    this._quizzes.map(quizData => {
      if (quizData.quiz.every(el => quiz.includes(el))) {
        quizData.timesPlayed++;
        this._userTimesPlayedData[quizData.id] = quizData.timesPlayed;
        this._saveUserTimesPlayedData();
      }
    });
  }

}