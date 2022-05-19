import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { QuizPageComponent } from '@components/quiz-page/quiz-page.component';
import { AuthorizationPageComponent } from '@components/authorization-page/authorization-page.component';
import { LeaveQuizGuard } from '@guards/leave-quiz.guard';
import { StatisticPageComponent } from '@components/statistic-page/statistic-page.component';
import { IsLoggedInGuard } from '@guards/is-logged-in.guard';
import { IsLoggedOutGuard } from '@guards/is-logged-out.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'quiz', component: QuizPageComponent, canDeactivate: [LeaveQuizGuard] },
  { path: 'registration', component: AuthorizationPageComponent, canActivate: [IsLoggedOutGuard] },
  { path: 'authorization', component: AuthorizationPageComponent, canActivate: [IsLoggedOutGuard] },
  { path: 'statistic', component: StatisticPageComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
