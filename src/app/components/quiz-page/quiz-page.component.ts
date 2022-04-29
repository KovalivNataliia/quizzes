import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { QuizService } from '@services/quiz.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.scss']
})
export class QuizPageComponent {

  questionCount$: Observable<number>;
  currentQuestionIndex$: Observable<number>;
  currentQuestion$: Observable<string>;
  currentAnswers$: Observable<string[]>;

  constructor(public quizService: QuizService) {
    this.questionCount$ = this.quizService.state$.pipe(
      map((state) => state.currentQuiz.length)
    );
    this.currentQuestionIndex$ = this.quizService.state$.pipe(
      map((state) => state.currentQuestionIndex + 1)
    );
    this.currentQuestion$ = this.quizService.state$.pipe(
      map((state) => state.currentQuiz[state.currentQuestionIndex].question)
    );
    this.currentAnswers$ = this.quizService.state$.pipe(
      map((state) => state.currentAnswers)
    );
  }

  nextQuestion() {
    this.quizService.nextQuestion();
  }

  previousQuestion() {
    this.quizService.previousQuestion();
  }

}
