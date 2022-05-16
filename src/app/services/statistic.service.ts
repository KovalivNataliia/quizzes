import { Injectable } from "@angular/core";
import { QuizResult } from "@shared/interfaces/quizResult.interface";
import { StatisticTableData } from "@shared/interfaces/statisticTableData.interface";
import { UserStatisticData } from "@shared/interfaces/userStatisticData.interface";
import { ChartData } from "chart.js";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private _userStatistic = JSON.parse(localStorage.getItem('userStatistic')!) || {};

  public saveStatistic(quizName: string, quizResult: QuizResult): void {
    let { correctAnswersCount: questionsCount, pointsCount, quizTimeCount } = quizResult;
    let quizzesCount = 1;
    const currentQuizTypeStatistic = this._userStatistic[quizName];
    if (currentQuizTypeStatistic) {
      quizzesCount = currentQuizTypeStatistic.quizzesCount + 1;
      questionsCount = currentQuizTypeStatistic.questionsCount + questionsCount;
      pointsCount = currentQuizTypeStatistic.pointsCount + pointsCount;
      quizTimeCount = currentQuizTypeStatistic.quizTimeCount + quizTimeCount;
    }
    this._userStatistic[quizName] = { quizzesCount, questionsCount, pointsCount, quizTimeCount };
    localStorage.setItem('userStatistic', JSON.stringify(this._userStatistic));
  }

  public getStatistic(): UserStatisticData {
    return this._userStatistic;
  }

  public getStatisticData(dataType: string): ChartData<'pie'> {
    const statistic = this.getStatistic();
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

  public getStatisticTableData(): StatisticTableData[] {
    const statistic = this.getStatistic();
    const statisticTableData = [];
    for (let key in statistic) {
      statisticTableData.push({quizType: key, ...statistic[key]})
    }
    return statisticTableData;
  }

  private _getChartData(chartData: number[]): ChartData<'pie'> {
    const quizzesTypes = this._getQuzzesTypes();
    return { labels: quizzesTypes, datasets: [{ data: chartData }] };
  }

  private _getQuzzesTypes(): string[] {
    return Object.keys(this._userStatistic);
  }

  private _convertMilliseconds(milliseconds: number): number {
    let seconds: string | number = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    seconds = (seconds % 60).toString().padStart(2, '0');
    return Number(`${minutes}.${seconds}`);
  }

}