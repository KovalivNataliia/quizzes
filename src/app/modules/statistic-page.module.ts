import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { StatisticPageComponent } from '@components/statistic-page/statistic-page.component';
import { PipeModule } from '@modules/pipe.module';

@NgModule({
  declarations: [StatisticPageComponent],
  imports: [
    CommonModule,
    NgChartsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    PipeModule
  ],
  exports: [StatisticPageComponent]
})
export class StatisticPageModule { }