import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';
import { Subscription, switchMap, tap } from 'rxjs';
import { AuthorizationService } from '@services/authorization.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

  public quizzes: QuizData[];
  public noResults = false;
  public searchMode = false;
  private _subscriptions = new Subscription();
  private _isAuth$ = this.authService.isAuth$;
  private _quizData!: Partial<QuizData>;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthorizationService
  ) {
    this.quizzes = this.quizService.getQuizzes();
  }

  ngOnInit(): void {
    if (!this.quizzes.length || this._isAuth$.value && !this.quizService.userQuizzes) {
      this._subscriptions.add(
        this.quizService.getDefaultQuizzes().subscribe(data => {
          this.quizzes = data.quizzes;
          this.quizService.updateQuizzes(this.quizzes);
          if (this._isAuth$.value && !this.quizService.userQuizzes) {
            const userId = JSON.parse(sessionStorage.getItem('user')!).userId;
            this.quizService.getUserQuizzes(userId).subscribe(data => {
              this.quizService.userQuizzes = data.userQuizzes;
              this.quizzes = [...this.quizzes, ...data.userQuizzes];
              this.quizService.updateQuizzes(this.quizzes);
            })
          }
        })
      );
    }
  }

  public playRandomQuiz(): void {
    this._subscriptions.add(
      this.quizService.getRandomQuiz().subscribe(quiz => {
        this.quizService.answers = this.quizService.shuffleAnswers(quiz);
        const stateData = {
          currentQuiz: quiz,
          currentAnswers: this.quizService.answers[0],
          currentQuestionIndex: 0,
          pointsPerQuestion: 100,
          quizStartTime: performance.now(),
          quizEndTime: null,
          isQuizDataSaved: false
        }
        this.quizService.setState(stateData);
        this.router.navigate(['/quiz']);
      })
    );
  }

  public playQuiz(quizData: QuizData): void {
    const quiz = quizData.quiz;
    this.quizService.answers = this.quizService.shuffleAnswers(quiz);
    const stateData = {
      currentQuiz: quiz,
      currentQuizId: quizData._id,
      currentAnswers: this.quizService.answers[0],
      currentQuestionIndex: 0,
      pointsPerQuestion: quizData.pointsPerQuestion,
      quizStartTime: performance.now(),
      quizEndTime: null,
      isQuizDataSaved: false
    }
    this.quizService.setState(stateData);
    this.router.navigate(['/quiz']);
  }

  public searchByQuizName(event$: { text: string }): void {
    this.searchMode = true;
    this.quizzes = this.quizService.searchQuiz(event$.text);
    this.noResults = !this.quizzes.length;
  }

  public sortQuizzes(event$: { selectedValue: string }): void {
    this.searchMode = false;
    this.quizzes = this.quizService.sortQuizzes(event$.selectedValue);
  }

  public createQuiz(event$: CreateQuizData): void {
    if (event$) {
      const { pointsPerQuestion } = event$;
      this._subscriptions.add(
        this.quizService.getQuiz(event$).pipe(
          tap(quiz => {
            this._quizData = {
              quizName: quiz[0].category,
              pointsPerQuestion: +pointsPerQuestion,
              quiz
            }
          }),
          switchMap(() => this.quizService.addQuiz(this._quizData)),
        ).subscribe(data => {
          if (data.message === 'Success') {
            this.quizzes = [...this.quizzes, data.quiz];
            this.quizService.updateQuizzes(this.quizzes);
            this.searchMode = false;
          }
        })
      );
    }
  }

  public removeQuiz($event: { quizId: string }): void {
    const { quizId } = $event;
    this._subscriptions.add(
      this.quizService.removeQuiz(quizId).subscribe(data => {
        if (data.message === 'Success') {
          this.quizzes = this.quizzes.filter(quiz => quiz._id !== quizId);
          this.quizService.updateQuizzes(this.quizzes);
          this.searchMode = false;
        }
      })
    );
  }

  public goBack(): void {
    this.searchMode = false;
    this.quizzes = this.quizService.getQuizzes();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
