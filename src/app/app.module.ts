import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageModule } from '@modules/home-page.module';
import { QuizPageModule } from '@modules/quiz-page.module';
import { QuizService } from '@services/quiz.service';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@modules/dialog.module';
import { DialogService } from '@services/dialog.service';
import { LeaveQuizGuard } from '@guards/leave-quiz.guard';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HomePageModule,
    QuizPageModule,
    DialogModule
  ],
  providers: [
    QuizService,
    DialogService,
    LeaveQuizGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
