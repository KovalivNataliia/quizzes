import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QuizService } from '@services/quiz.service';
import { QuizCategory } from '@shared/interfaces/quizCategory.interface';

@Component({
  selector: 'app-create-quiz-dialog',
  templateUrl: './create-quiz-dialog.component.html',
  styleUrls: ['./create-quiz-dialog.component.scss']
})
export class CreateQuizDialogComponent {

  quizCategories!: QuizCategory[];
  categoryId!: string;
  quizDifficulty!: string;
  pointsPerQuestion!: string;
  questionCount!: number;
  maxQuestionCount!: number;

  constructor(
    private dialogRef: MatDialogRef<CreateQuizDialogComponent>,
    private quizService: QuizService
  ) {
    this.quizService.getQuizCategories().subscribe(categories => {
      this.quizCategories = categories;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getQuestionCount(): void {
    this.quizService.getQuestionCount(this.categoryId).subscribe(questionCount => {
      const key = `total_${this.quizDifficulty}_question_count`;
      this.maxQuestionCount = questionCount[key] > 50 ? 50 : questionCount[key];
    })
  }

}
