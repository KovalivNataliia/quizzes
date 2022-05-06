import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

  constructor(public dialog: MatDialog, private router: Router) { }

  public openResultDialog(quizResult: QuizResult): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      data: quizResult
    });

    dialogRef.afterClosed().subscribe(() => this.router.navigate(['/home']));
  }

  public openLeaveQuizDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(LeaveQuizDialogComponent, {
      width: '350px'
    });
    return dialogRef.afterClosed();
  }

  openCreateQuizDialog(): Observable<CreateQuizData> {
    const dialogRef = this.dialog.open(CreateQuizDialogComponent, {
      width: '500px'
    });
    return dialogRef.afterClosed()
  }

}