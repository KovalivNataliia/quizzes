import { Component, Input } from '@angular/core';
import { QuizData } from '@shared/interfaces/quizData.interface';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss']
})
export class QuizCardComponent {

  @Input() quizData!: QuizData;

}
