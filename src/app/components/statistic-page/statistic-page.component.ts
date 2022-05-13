import { Component, OnInit } from '@angular/core';
import { StatisticService } from '@services/statistic.service';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
export class StatisticPageComponent implements OnInit {

  public quizzesPlayedData!: ChartData<'pie'>;
  public correctAnswersData!: ChartData<'pie'>;
  public averagePointsData!: ChartData<'pie'>;
  public averageTimeData!: ChartData<'pie'>;
  public pieChartType: ChartType = 'pie';

  constructor(private statisticService: StatisticService) { }

  ngOnInit(): void {
    this.quizzesPlayedData = this.statisticService.getStatisticData('quizzesPlayed');
    this.correctAnswersData = this.statisticService.getStatisticData('correctAnswers');
    this.averagePointsData = this.statisticService.getStatisticData('averagePoints');
    this.averageTimeData = this.statisticService.getStatisticData('averageTime');
  }

}
