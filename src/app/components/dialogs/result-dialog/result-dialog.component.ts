import { Component, Inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuizService } from '@services/quiz.service';
import { QuizResult } from '@shared/interfaces/quizResult.interface';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent {

  questionCount$: Observable<number>;

  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuizResult,
    private quizService: QuizService
  ) { 
    this.questionCount$ = this.quizService.state$.pipe(
      map((state) => state.currentQuiz.length)
    );
  }

}
