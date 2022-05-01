import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { QuizService } from '@services/quiz.service';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent {

  questionCount$: Observable<number>;
  currentQuestionIndex$: Observable<number>;
  currentQuestion$: Observable<string>;
  currentAnswers$: Observable<string[]>;
  isQuizDataSaved!: boolean;
  userAnswers: string[] = [];

  constructor(private quizService: QuizService, private dialogService: DialogService) {
    this.questionCount$ = this.quizService.state$.pipe(
      map((state) => state.currentQuiz.length)
    );
    this.currentQuestionIndex$ = this.quizService.state$.pipe(
      map((state) => state.currentQuestionIndex + 1)
    );
    this.currentQuestion$ = this.quizService.state$.pipe(
      map((state) => state.currentQuiz[state.currentQuestionIndex].question)
    );
    this.currentAnswers$ = this.quizService.state$.pipe(
      map((state) => state.currentAnswers)
    );
  }

  nextQuestion(): void {
    this.quizService.nextQuestion();
  }

  previousQuestion(): void {
    this.quizService.previousQuestion();
  }

  setAnswer(answer: string): void {
    const state = this.quizService.getState();
    this.userAnswers[state.currentQuestionIndex] = answer;
  }

  isFirstQuestion(): boolean {
    return !this.quizService.getState().currentQuestionIndex;
  }

  isLastQuestion(): boolean {
    const state = this.quizService.getState();
    return state.currentQuestionIndex === state.currentQuiz.length - 1;
  }

  isAlreadyChecked(answer?: string): boolean {
    const state = this.quizService.getState();
    return this.userAnswers[state.currentQuestionIndex] === answer;
  }

  showResults(): void {
    const quizResult = this.quizService.getQuizResult(this.userAnswers);
    this.dialogService.openResultDialog(quizResult);
  }

  canDeactivate(): Observable<boolean> | boolean {
    const state = this.quizService.getState();
    this.isQuizDataSaved = state.isQuizDataSaved;
    if (!this.isQuizDataSaved) {
      return this.dialogService.openLeaveQuizDialog();
    }
    return true;
  }

}
