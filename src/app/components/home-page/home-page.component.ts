import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy {

  public quizzes = this.quizService.getQuizzes();
  public noResults = false;
  public searchMode = false;
  private _subscriptions = new Subscription();

  constructor(private quizService: QuizService, private router: Router) { }

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
          this.quizService.createQuiz(quiz, pointsPerQuestion);
          this.quizzes = this.quizService.getQuizzes();
          this.searchMode = false;
        })
      );
    }
  }

  public removeQuiz($event: { quizId: number }): void {
    const { quizId } = $event;
    this.quizService.removeQuiz(quizId);
    this.quizzes = this.quizService.getQuizzes();
    this.searchMode = false;
  }

  public goBack(): void {
    this.searchMode = false;
    this.quizzes = this.quizService.getQuizzes();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
