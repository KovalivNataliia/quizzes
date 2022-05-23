import { AfterViewChecked, Component, OnDestroy, ViewChild } from '@angular/core';
import { StatisticService } from '@services/statistic.service';
import { ChartData, ChartType } from 'chart.js';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StatisticData } from '@shared/interfaces/statisticData.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
export class StatisticPageComponent implements AfterViewChecked, OnDestroy {

  public showStatisticTable = false;
  public toggleBtnText = 'Table';
  public isStatisticDataExist = false;

  public quizzesPlayedData!: ChartData<'pie'>;
  public correctAnswersData!: ChartData<'pie'>;
  public averagePointsData!: ChartData<'pie'>;
  public averageTimeData!: ChartData<'pie'>;
  public pieChartType: ChartType = 'pie';

  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns!: string[];
  public dataSource!: MatTableDataSource<StatisticData>;

  private _statisticData!: StatisticData[];
  private _subscriptions = new Subscription();

  constructor(public statisticService: StatisticService) { }

  ngOnInit(): void {
    const sub = this.statisticService.getUserStatistic().subscribe(statistic => {
      statistic = statistic || [];
      this.statisticService.setStatistic(statistic);
      this._statisticData = statistic;
      if (this._statisticData.length) {
        this.isStatisticDataExist = true;
        const getChartData = this.statisticService.getStatisticChartData.bind(this.statisticService);
        this.quizzesPlayedData = getChartData('quizzesPlayed');
        this.correctAnswersData = getChartData('correctAnswers');
        this.averagePointsData = getChartData('averagePoints');
        this.averageTimeData = getChartData('averageTime');

        this.displayedColumns = ['quizType', 'quizzesCount', 'questionsCount', 'pointsCount', 'quizTimeCount'];
        this.dataSource = new MatTableDataSource(this._statisticData);
        this.dataSource.sort = this.sort;
      }
    })
    this._subscriptions.add(sub);
  }

  ngAfterViewChecked(): void {
    if (this._statisticData) {
      this.dataSource.sort = this.sort;
    }
  }

  public toggleStatisticView(): void {
    this.showStatisticTable = !this.showStatisticTable;
    this.toggleBtnText = this.showStatisticTable ? 'Charts' : 'Table';
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
