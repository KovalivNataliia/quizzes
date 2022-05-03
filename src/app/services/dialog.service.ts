import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaveQuizDialogComponent } from '@components/dialogs/leave-quiz-dialog/leave-quiz-dialog.component';
import { ResultDialogComponent } from '@components/dialogs/result-dialog/result-dialog.component';
import { QuizResult } from '@shared/interfaces/quizResult.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog, private router: Router) { }

  openResultDialog(quizResult: QuizResult): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '500px',
      data: quizResult
    });

    dialogRef.afterClosed().subscribe(() => this.router.navigate(['/home']));
  }

  openLeaveQuizDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(LeaveQuizDialogComponent, {
      width: '350px'
    });
    return dialogRef.afterClosed();
  }

}