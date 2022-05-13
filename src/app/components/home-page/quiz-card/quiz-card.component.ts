import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuizData } from '@shared/interfaces/quizData.interface';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss']
})
export class QuizCardComponent {

  @Input() quizData!: QuizData;
  @Output() emitPlayQuiz: EventEmitter<QuizData> = new EventEmitter();
  @Output() emitRemoveQuiz: EventEmitter<{quizId: number}> = new EventEmitter();

  public playQuiz(quizData: QuizData): void {
    this.emitPlayQuiz.emit(quizData);
  }

  public removeQuiz(quizId: number): void {
    this.emitRemoveQuiz.emit({quizId});
  }
}
