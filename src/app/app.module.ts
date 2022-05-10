import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderModule } from '@modules/header.module';
import { HomePageModule } from '@modules/home-page.module';
import { QuizPageModule } from '@modules/quiz-page.module';
import { DialogModule } from '@modules/dialog.module';
import { QuizService } from '@services/quiz.service';
import { DialogService } from '@services/dialog.service';
import { LeaveQuizGuard } from '@guards/leave-quiz.guard';
import { ServerErrorInterceptor } from '@interceptors/http-error.interceptor';
import { ErrorHandlerService } from '@services/error-handler.service';
import { SpinnerService } from '@services/spinner.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HeaderModule,
    HomePageModule,
    QuizPageModule,
    DialogModule,
    MatSnackBarModule
  ],
  providers: [
    QuizService,
    DialogService,
    SpinnerService,
    LeaveQuizGuard,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
