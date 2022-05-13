import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { StatisticPageComponent } from '@components/statistic-page/statistic-page.component';

@NgModule({
  declarations: [StatisticPageComponent],
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports: [StatisticPageComponent]
})
export class StatisticPageModule { }