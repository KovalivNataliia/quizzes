import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { QuizPageComponent } from '@components/quiz-page/quiz-page.component';
import { PipeModule } from '@modules/pipe.module';

@NgModule({
  declarations: [
    QuizPageComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    RouterModule,
    PipeModule
  ],
  exports: [QuizPageComponent]
})
export class QuizPageModule { }