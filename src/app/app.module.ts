import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SpinnerComponent } from '@components/spinner/spinner.component';
import { HeaderModule } from '@modules/header.module';
import { HomePageModule } from '@modules/home-page.module';
import { QuizPageModule } from '@modules/quiz-page.module';
import { DialogModule } from '@modules/dialog.module';
import { AuthorizationPageModule } from '@modules/authorization-page.module';
import { QuizService } from '@services/quiz.service';
import { DialogService } from '@services/dialog.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { SpinnerService } from '@services/spinner.service';
import { AuthorizationService } from '@services/authorization.service';
import { LeaveQuizGuard } from '@guards/leave-quiz.guard';
import { ServerErrorInterceptor } from '@interceptors/http-error.interceptor';
import { SpinnerInterceptor } from '@interceptors/spinner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
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
    MatSnackBarModule,
    AuthorizationPageModule,
    MatProgressSpinnerModule
  ],
  providers: [
    QuizService,
    DialogService,
    SpinnerService,
    AuthorizationService,
    LeaveQuizGuard,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
   },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
