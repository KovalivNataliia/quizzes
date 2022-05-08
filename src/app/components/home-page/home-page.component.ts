import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  public quizzes = this.quizService.getQuizzes();
  public showSpinner = false;
  public noResults = false;
  public searchMode = false;

  constructor(private quizService: QuizService, private router: Router) { }

  public playRandomQuiz(): void {
    this.showSpinner = true;
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
    });
  }

  public playQuiz(quizData: QuizData): void {
    this.showSpinner = true;
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

  public sortQuizzes(event$: {selectedValue: string}) {
    this.searchMode = false;
    this.quizzes = this.quizService.sortQuizzes(event$.selectedValue);
  }

  public createQuiz(event$: CreateQuizData) {
    if (event$) {
      this.showSpinner = true;
      const { pointsPerQuestion } = event$;
      const quizzes = this.quizService.getQuizzes();
      this.quizService.getQuiz(event$).subscribe(quiz => {
        const lastQuiz = quizzes[quizzes.length - 1];
        const quizData = {
          id: lastQuiz.id + 1,
          quizName: quiz[0].category,
          pointsPerQuestion: +pointsPerQuestion,
          timesPlayed: 0,
          createdByUser: true,
          quiz
        }
        this.quizzes = [...quizzes, quizData];
        this.quizService.quizzes = this.quizzes;
        this.showSpinner = false;
        this.searchMode = false;
      })
    }
  }

  public goBack(): void {
    this.searchMode = false;
    this.quizzes = this.quizService.getQuizzes();
  }

}
