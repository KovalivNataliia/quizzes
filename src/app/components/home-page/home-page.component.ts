import { Component, OnInit } from '@angular/core';
import { QuizService } from '@services/quiz.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  showSpinner: boolean = false;

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
  }

  playRandomQuiz(): void {
    this.showSpinner = true;
    this.quizService.getRandomQuiz();
  }

}
