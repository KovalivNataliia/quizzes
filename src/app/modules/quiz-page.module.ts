import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { QuizPageComponent } from '@components/quiz-page/quiz-page.component';
import { DecodeHtmlPipe } from '@pipes/decode-html.pipe';

@NgModule({
  declarations: [
    QuizPageComponent,
    DecodeHtmlPipe
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ],
  exports: [QuizPageComponent]
})
export class QuizPageModule { }