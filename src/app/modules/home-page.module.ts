import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomePageComponent } from '@components/home-page/home-page.component';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [HomePageComponent]
})
export class HomePageModule { }