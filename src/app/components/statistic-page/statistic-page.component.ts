import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { StatisticService } from '@services/statistic.service';
import { ChartData, ChartType } from 'chart.js';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StatisticTableData } from '@shared/interfaces/statisticTableData.interface';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss']
})
export class StatisticPageComponent implements AfterViewInit {

  public showStatisticTable = false;
  public toggleBtnText = 'Table';

  public quizzesPlayedData: ChartData<'pie'>;
  public correctAnswersData: ChartData<'pie'>;
  public averagePointsData: ChartData<'pie'>;
  public averageTimeData: ChartData<'pie'>;
  public pieChartType: ChartType = 'pie';

  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<StatisticTableData>;
  private _statisticTableData: StatisticTableData[];

  constructor(private statisticService: StatisticService) {
    this.quizzesPlayedData = this.statisticService.getStatisticData('quizzesPlayed');
    this.correctAnswersData = this.statisticService.getStatisticData('correctAnswers');
    this.averagePointsData = this.statisticService.getStatisticData('averagePoints');
    this.averageTimeData = this.statisticService.getStatisticData('averageTime');

    this._statisticTableData = this.statisticService.getStatisticTableData();
    this.displayedColumns = Object.keys(this._statisticTableData[0]);
    this.dataSource = new MatTableDataSource(this._statisticTableData);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public toggleStatisticView(): void {
    this.showStatisticTable = !this.showStatisticTable;
    this.toggleBtnText = this.showStatisticTable ? 'Charts' : 'Table';
  }

}
