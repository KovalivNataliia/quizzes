import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { QuizItem } from '@shared/interfaces/quizItem.interface';
import { QuizResult } from '@shared/interfaces/quizResult.interface';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { QuizCategory } from '@shared/interfaces/quizCategory.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';
import { StatisticService } from '@services/statistic.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  public answers!: string[][];
  public userQuizzes!: QuizData[] | null;
  private _state$!: BehaviorSubject<QuizState>;
  private _quizzes: QuizData[] = [];
  private _randomQuizUrl: string = 'https://opentdb.com/api.php?amount=10';
  private _quizCategoriesUrl: string = 'https://opentdb.com/api_category.php';
  private _questionCountUrl: string = 'https://opentdb.com/api_count.php?category=';
  private _url = 'http://localhost:8080/api/quizzes/';
  private _headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private statisticService: StatisticService) { }

  public getQuizzes(): QuizData[] {
    return this._quizzes;
  }

  public resetQuizzes(): void {
    this._quizzes = [];
    this.userQuizzes = null;
  }

  public updateQuizzes(quizzes: QuizData[]): void {
    this._quizzes = quizzes;
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
    return this.http.get(this._quizCategoriesUrl).pipe(
      map((response: any) => response.trivia_categories)
    );
  }

  public getQuestionCount(id: string): Observable<{ [key: string]: number }> {
    return this.http.get(this._questionCountUrl + id).pipe(
      map((response: any) => response.category_question_count)
    );
  }

  public getDefaultQuizzes(): Observable<any> {
    return this.http.get(this._url, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public getUserQuizzes(userId: string): Observable<any> {
    return this.http.get(this._url + userId, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public addQuiz(quizData: Partial<QuizData>): Observable<any> {
    return this.http.post(this._url, quizData, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public updateQuiz(quizId: string): Observable<any> {
    return this.http.patch(this._url + quizId, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
  }

  public removeQuiz(quizId: string): Observable<any> {
    return this.http.delete(this._url + quizId, { headers: this._headers }).pipe(
      map((response: any) => response)
    );
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
    const quizName = this._getQuizName(state.currentQuizId);
    const quizResult = { correctAnswersCount, pointsCount, quizTimeCount }
    this.statisticService.saveStatistic(quizName, quizResult);
    this._setPartialState({
      isQuizDataSaved: true
    });
    return quizResult;
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

  public changeTimesPlayedData(quizId: string): void {
    const currentQuiz = this._quizzes.find(quizData => quizData._id === quizId);
    currentQuiz!.timesPlayed++
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

  private _getQuizName(quizId: string | undefined): string {
    const currentQuiz = this._quizzes.find(quizData => quizData._id === quizId);
    return currentQuiz ? currentQuiz.quizName : 'Random quiz';
  }

}