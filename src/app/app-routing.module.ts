import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { QuizPageComponent } from '@components/quiz-page/quiz-page.component';
import { LeaveQuizGuard } from '@guards/leave-quiz.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'quiz', component: QuizPageComponent, canDeactivate: [LeaveQuizGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
