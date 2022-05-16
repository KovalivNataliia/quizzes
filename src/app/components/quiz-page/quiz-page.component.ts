import { Component, OnDestroy } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { QuizService } from '@services/quiz.service';
import { DialogService } from '@services/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent implements OnDestroy {

  public questionCount$: Observable<number>;
  public currentQuestionIndex$: Observable<number>;
  public currentQuestion$: Observable<string>;
  public currentAnswers$: Observable<string[]>;
  public userAnswers: string[] = [];
  private _state$ = this.quizService.getState();
  private _subscriptions = new Subscription();

  constructor(
    private quizService: QuizService,
    private dialogService: DialogService,
    private router: Router
  ) {
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
    const state = this.quizService.getStateValue();
    const quizId = state.currentQuizId;
    if (quizId) {
      this._subscriptions.add(
        this.quizService.updateQuiz(quizId).subscribe(data => {
          if (data.message === 'Success') {
            this.quizService.changeTimesPlayedData(quizId);
          }
        })
      );
    }
    const quizResult = this.quizService.getQuizResult(this.userAnswers);
    this._subscriptions.add(
      this.dialogService.openResultDialog(quizResult).subscribe(
        () => this.router.navigate(['/home'])
      )
    );

  }

  public canDeactivate(): Observable<boolean> | boolean {
    const state = this.quizService.getStateValue();
    if (!state.isQuizDataSaved) {
      return this.dialogService.openLeaveQuizDialog();
    }
    return true;
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
