import { Component, OnInit } from '@angular/core';
import { QuizService } from '@services/quiz.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
  }

  playRandomQuiz() {
    this.quizService.getRandomQuiz();
  }

}
