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

  public questionCount$: Observable<number>;
  public currentQuestionIndex$: Observable<number>;
  public currentQuestion$: Observable<string>;
  public currentAnswers$: Observable<string[]>;
  public userAnswers: string[] = [];
  private _state$ = this.quizService.getState();

  constructor(private quizService: QuizService, private dialogService: DialogService) {
    this.questionCount$ = this._state$.pipe(
      map((state) => state.currentQuiz.length)
    );
    this.currentQuestionIndex$ = this._state$.pipe(
      map((state) => state.currentQuestionIndex)
    );
    this.currentQuestion$ = this._state$.pipe(
      map((state) => state.currentQuiz[state.currentQuestionIndex].question)
    );
    this.currentAnswers$ = this._state$.pipe(
      map((state) => state.currentAnswers)
    );
  }

  public nextQuestion(): void {
    this.quizService.nextQuestion();
  }

  public previousQuestion(): void {
    this.quizService.previousQuestion();
  }

  public setAnswer(answer: string): void {
    const state = this.quizService.getStateValue();
    this.userAnswers[state.currentQuestionIndex] = answer;
  }

  public showResults(): void {
    const quizResult = this.quizService.getQuizResult(this.userAnswers);
    this.dialogService.openResultDialog(quizResult);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    const state = this.quizService.getStateValue();
    if (!state.isQuizDataSaved) {
      return this.dialogService.openLeaveQuizDialog();
    }
    return true;
  }

}
