import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { QuizResult } from "@shared/interfaces/quizResult.interface";
import { StatisticData } from "@shared/interfaces/statisticData.interface";
import { ChartData } from "chart.js";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private _userStatistic!: StatisticData[];
  private _url = 'http://localhost:8080/api/users/statistic';
  private _headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public getStatisticData(quizType: string, quizResult: QuizResult): StatisticData {
    let { questionsCount, pointsCount, quizTimeCount } = quizResult;
    let quizzesCount = 1;
    let currentQuizType = this._userStatistic.find(statistic => statistic.quizType === quizType);
    if (currentQuizType) {
      quizzesCount = currentQuizType.quizzesCount + 1;
      questionsCount = currentQuizType.questionsCount + questionsCount;
      pointsCount = currentQuizType.pointsCount + pointsCount;
      quizTimeCount = currentQuizType.quizTimeCount + quizTimeCount;
    }
    const userId = JSON.parse(sessionStorage.getItem('user')!).userId;
    currentQuizType = { userId, quizType, quizzesCount, questionsCount, pointsCount, quizTimeCount };
    return currentQuizType;
  }

  public getUserStatistic(): Observable<StatisticData[]> {
    return this.http.get(this._url, { headers: this._headers }).pipe(
      map((response: any) => response.statistic)
    )
  }

  public updateUserStatistic(statisticData: StatisticData): Observable<StatisticData> {
    return this.http.put(this._url, statisticData, { headers: this._headers }).pipe(
      map((response: any) => response.statistic)
    );
  }

  public getCurrentStatisticData(): StatisticData[] {
    return this._userStatistic;
  }

  public updateCurrentStatisticData(statisticData: StatisticData): void {
    const currentQuizType = this._userStatistic.find(statistic => {
      return statistic.quizType === statisticData.quizType
    });
    if (!currentQuizType) {
      this._userStatistic.push(statisticData);
    } else {
      this._userStatistic.map((el, idx, arr) => {
        if (el.quizType === statisticData.quizType) {
          arr.splice(idx, 1, statisticData);
        }
      })
    }
  }

  public setStatistic(statistic: StatisticData[]): void {
    this._userStatistic = statistic;
  }

  public getStatisticChartData(dataType: string): ChartData<'pie'> {
    const statistic = this.getCurrentStatisticData();
    const chartData = [];
    for (let key in statistic) {
      let type = statistic[key];
      switch (dataType) {
        case 'quizzesPlayed':
          chartData.push(type.quizzesCount);
          break;
        case 'correctAnswers':
          chartData.push(type.questionsCount);
          break;
        case 'averagePoints':
          chartData.push(Math.floor(type.pointsCount / type.quizzesCount));
          break;
        case 'averageTime':
          const milliseconds = type.quizTimeCount / type.quizzesCount;
          chartData.push(this._convertMilliseconds(milliseconds));
          break;
      }
    }
    return this._getChartData(chartData);
  }

  private _getChartData(chartData: number[]): ChartData<'pie'> {
    const quizzesTypes = this._getQuzzesTypes();
    return { labels: quizzesTypes, datasets: [{ data: chartData }] };
  }

  private _getQuzzesTypes(): string[] {
    const statistic = this.getCurrentStatisticData();
    const quizzesTypes = [];
    for (let obj of statistic) {
      quizzesTypes.push(obj.quizType);
    }
    return quizzesTypes;
  }

  private _convertMilliseconds(milliseconds: number): number {
    let seconds: string | number = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    seconds = (seconds % 60).toString().padStart(2, '0');
    return Number(`${minutes}.${seconds}`);
  }

}