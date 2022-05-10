import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  showSpinner: boolean = false;
  quizzes: QuizData[] = this.quizService.getQuizzes();

  constructor(private quizService: QuizService, private router: Router) { }

  playRandomQuiz(): void {
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

  playQuiz(quizData: QuizData): void {
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

}
