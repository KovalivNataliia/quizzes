import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LeaveQuizDialogComponent } from '@components/dialogs/leave-quiz-dialog/leave-quiz-dialog.component';
import { ResultDialogComponent } from '@components/dialogs/result-dialog/result-dialog.component';
import { CreateQuizDialogComponent } from '@components/dialogs/create-quiz-dialog/create-quiz-dialog.component';
import { QuizResult } from '@shared/interfaces/quizResult.interface';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  public openResultDialog(quizResult: QuizResult): Observable<boolean> {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      data: quizResult
    });
    return dialogRef.afterClosed();
  }

  public openLeaveQuizDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(LeaveQuizDialogComponent, {
      width: '350px'
    });
    return dialogRef.afterClosed();
  }

  public openCreateQuizDialog(): Observable<CreateQuizData> {
    const dialogRef = this.dialog.open(CreateQuizDialogComponent, {
      width: '500px'
    });
    return dialogRef.afterClosed()
  }

}