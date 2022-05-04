import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '@services/quiz.service';
import { QuizData } from '@shared/interfaces/quizData.interface';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  showSpinner: boolean = false;
  quizzes!: QuizData[];

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.quizzes = this.quizService.getQuizzes();
  }

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

}
