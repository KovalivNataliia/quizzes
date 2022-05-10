import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { QuizCardComponent } from '@components/home-page/quiz-card/quiz-card.component';

@NgModule({
  declarations: [
    HomePageComponent,
    QuizCardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  exports: [HomePageComponent]
})
export class HomePageModule { }