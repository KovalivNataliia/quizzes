import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QuizService } from '@services/quiz.service';
import { QuizCategory } from '@shared/interfaces/quizCategory.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-quiz-dialog',
  templateUrl: './create-quiz-dialog.component.html',
  styleUrls: ['./create-quiz-dialog.component.scss']
})
export class CreateQuizDialogComponent implements OnDestroy {

  public quizCategories!: QuizCategory[];
  public categoryId!: string;
  public quizDifficulty!: string;
  public pointsPerQuestion!: string;
  public questionCount!: number;
  public maxQuestionCount!: number;
  private _subscriptions = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<CreateQuizDialogComponent>,
    private quizService: QuizService
  ) {
    const sub = this.quizService.getQuizCategories().subscribe(categories => {
      this.quizCategories = categories;
    })
    this._subscriptions.add(sub);
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public getQuestionCount(): void {
    const sub = this.quizService.getQuestionCount(this.categoryId).subscribe(questionCount => {
      const key = `total_${this.quizDifficulty}_question_count`;
      this.maxQuestionCount = questionCount[key] > 50 ? 50 : questionCount[key];
    })
    this._subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
