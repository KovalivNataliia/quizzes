import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ResultDialogComponent } from '@components/dialogs/result-dialog/result-dialog.component';
import { convertMillisecondsPipe } from '@pipes/convertMilliseconds.pipe';

@NgModule({
  declarations: [
    ResultDialogComponent,
    convertMillisecondsPipe
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [ResultDialogComponent]
})
export class DialogModule { }