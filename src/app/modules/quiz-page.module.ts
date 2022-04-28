import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { QuizPageComponent } from '@components/quiz-page/quiz-page.component';
import { DecodeHtmlPipe } from '@pipes/decode-html.pipe';

@NgModule({
  declarations: [
    QuizPageComponent,
    DecodeHtmlPipe
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [QuizPageComponent]
})
export class QuizPageModule { }