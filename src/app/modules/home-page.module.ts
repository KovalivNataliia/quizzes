import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { QuizCardComponent } from '@components/home-page/quiz-card/quiz-card.component';
import { HomeSidebarComponent } from '@components/home-page/home-sidebar/home-sidebar.component';

@NgModule({
  declarations: [
    HomePageComponent,
    QuizCardComponent,
    HomeSidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [HomePageComponent]
})
export class HomePageModule { }