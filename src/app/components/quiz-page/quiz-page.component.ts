import { Component, OnDestroy } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { QuizService } from '@services/quiz.service';
import { DialogService } from '@services/dialog.service';
import { Router } from '@angular/router';
import { AuthorizationService } from '@services/authorization.service';
import { StatisticService } from '@services/statistic.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent implements OnDestroy {

  public questionCount$!: Observable<number>;
  public currentQuestionIndex$!: Observable<number>;
  public currentQuestion$!: Observable<string>;
  public currentAnswers$!: Observable<string[]>;
  public userAnswers: string[] = [];
  private _state$ = this.quizService.getState();
  private _subscriptions = new Subscription();
  private _isAuth$ = this.authService.isAuth$;

  constructor(
    private quizService: QuizService,
    private dialogService: DialogService,
    private authService: AuthorizationService,
    private statisticService: StatisticService,
    private router: Router
  ) {
    if (this._state$) {
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
      const sub = this.quizService.updateQuiz(quizId).subscribe(data => {
        if (data.message === 'Success') {
          this.quizService.changeTimesPlayedData(quizId);
        }
      })
      this._subscriptions.add(sub);
    }
    const quizResult = this.quizService.getQuizResult(this.userAnswers);
    const sub = this.dialogService.openResultDialog(quizResult).subscribe(
      () => this.router.navigate(['/home'])
    )
    this._subscriptions.add(sub);
    if (this._isAuth$.value) {
      const quizType = this.quizService.getQuizType(quizId);
      const currentStatisticData = this.statisticService.getStatisticData(quizType, quizResult);
      const sub = this.statisticService.updateUserStatistic(currentStatisticData).subscribe(data => {
        this.statisticService.updateCurrentStatisticData(data);
      })
      this._subscriptions.add(sub);
    }
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
