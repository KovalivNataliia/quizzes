import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';
import { Subscription } from 'rxjs';
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
  private _userQuizzes: QuizData[] | null;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthorizationService
  ) {
    this.quizzes = this.quizService.getQuizzes();
    this._userQuizzes = this.quizService.userQuizzes;
  }

  ngOnInit(): void {
    if (this._isAuth$.value && !this._userQuizzes) {
      const userId = JSON.parse(sessionStorage.getItem('user')!).userId;
      this._subscriptions.add(
        this.quizService.getUserQuizzes(userId).subscribe(data => {
          this._userQuizzes = data.userQuizzes;
          this.quizService.userQuizzes = this._userQuizzes || [];
          this.quizzes = [...this.quizzes, ...this._userQuizzes!];
          this.quizService.updateQuizzes(this.quizzes);
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
        this.quizService.getQuiz(event$).subscribe(quiz => {
          const quizData = {
            quizName: quiz[0].category,
            pointsPerQuestion: +pointsPerQuestion,
            quiz
          }
          this.quizService.addQuiz(quizData).subscribe(data => {
            if (data.message === 'Success') {
              this.quizzes = [...this.quizzes, data.quiz];
              this.quizService.updateQuizzes(this.quizzes);
              this.searchMode = false;
            }
          });
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
