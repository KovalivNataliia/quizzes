import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ResultDialogComponent } from '@components/dialogs/result-dialog/result-dialog.component';
import { LeaveQuizDialogComponent } from '@components/dialogs/leave-quiz-dialog/leave-quiz-dialog.component';
import { convertMillisecondsPipe } from '@pipes/convertMilliseconds.pipe';
import { CreateQuizDialogComponent } from '@components/dialogs/create-quiz-dialog/create-quiz-dialog.component';

@NgModule({
  declarations: [
    ResultDialogComponent,
    LeaveQuizDialogComponent,
    convertMillisecondsPipe,
    CreateQuizDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule
  ],
  exports: [
    ResultDialogComponent,
    LeaveQuizDialogComponent
  ]
})
export class DialogModule { }