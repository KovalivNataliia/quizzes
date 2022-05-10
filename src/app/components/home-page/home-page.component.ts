import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  public quizzes = this.quizService.getQuizzes();
  public showSpinner = this.spinnerService.showSpinner;
  public noResults = false;
  public searchMode = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private spinnerService: SpinnerService
  ) { }

  public playRandomQuiz(): void {
    this.spinnerService.show();
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
      this.spinnerService.hide();
    });
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

  public searchByQuizName(event$: {text: string}): void {
    this.searchMode = true;
    this.quizzes = this.quizService.searchQuiz(event$.text);
    this.noResults = !this.quizzes.length;
  }

  public sortQuizzes(event$: {selectedValue: string}): void {
    this.searchMode = false;
    this.quizzes = this.quizService.sortQuizzes(event$.selectedValue);
  }

  public createQuiz(event$: CreateQuizData): void {
    if (event$) {
      this.spinnerService.show();
      const { pointsPerQuestion } = event$;
      this.quizService.getQuiz(event$).subscribe(quiz => {
        this.quizService.createQuiz(quiz, pointsPerQuestion);
        this.quizzes = this.quizService.getQuizzes();
        this.searchMode = false;
        this.spinnerService.hide();
      });
    }
  }

  public removeQuiz($event: {quizId: number}): void {
    const { quizId } = $event;
    this.quizService.removeQuiz(quizId);
    this.quizzes = this.quizService.getQuizzes();
    this.searchMode = false;
  }

  public goBack(): void {
    this.searchMode = false;
    this.quizzes = this.quizService.getQuizzes();
  }

}
