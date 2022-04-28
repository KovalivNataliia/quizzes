import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { QuizItem } from '@shared/interfaces/quizItem.interface';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  randomQuizUrl: string = 'https://opentdb.com/api.php?amount=10';
  state$!: BehaviorSubject<QuizState>;

  constructor(private http: HttpClient, private router: Router) { }

  getRandomQuiz(): void {
    this.http.get(this.randomQuizUrl).pipe(
      map((response: any) => response)).subscribe(data => {
        this.state$ = new BehaviorSubject<QuizState>({
          currentQuiz: data.results,
          answers: this.shuffleAnswers(data.results[0]),
          currentQuestionIndex: 0
        })
        this.router.navigate(['/quiz']);
      });
  }

  setState(partialState: Partial<QuizState>): void {
    this.state$.next({ ...this.state$.getValue(), ...partialState });
  }

  getState(): QuizState {
    return this.state$.getValue();
  }

  nextQuestion(): void {
    const state = this.getState();
    const canChange = state.currentQuestionIndex !== state.currentQuiz.length - 1;
    const newAnswers = canChange
      ? this.shuffleAnswers(state.currentQuiz[state.currentQuestionIndex + 1])
      : state.answers;
    const newcurrentQuestionIndex = canChange
      ? state.currentQuestionIndex + 1
      : state.currentQuestionIndex;
    this.setState({
      currentQuestionIndex: newcurrentQuestionIndex,
      answers: newAnswers
    });
  }

  previousQuestion(): void {
    const state = this.getState();
    const canChange = state.currentQuestionIndex !== 0;
    const newAnswers = canChange
      ? this.shuffleAnswers(state.currentQuiz[state.currentQuestionIndex - 1])
      : state.answers;
    const newcurrentQuestionIndex = canChange
      ? state.currentQuestionIndex - 1
      : state.currentQuestionIndex;
    this.setState({
      currentQuestionIndex: newcurrentQuestionIndex,
      answers: newAnswers
    });
  }

  shuffleAnswers(quizData: QuizItem): string[] {
    let answers = [...quizData.incorrect_answers, quizData.correct_answer];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers
  }

}