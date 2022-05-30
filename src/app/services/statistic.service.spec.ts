import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CurrentQuizTypeStatistic, StatisticData2, StatisticData3, QuizResult, StatisticData } from '@shared/test-data';
import { of } from 'rxjs';

import { StatisticService } from './statistic.service';

describe('StatisticService', () => {
  let service: StatisticService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    service = new StatisticService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user statistic', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of({ statistic: [StatisticData] }));
    service.getUserStatistic().subscribe(res => {
      expect(res).toEqual([StatisticData]);
      done();
    })
  });

  it('should update user statistic', (done: DoneFn) => {
    httpClientSpy.put.and.returnValue(of({ statistic: StatisticData }));
    service.updateUserStatistic(StatisticData).subscribe(res => {
      expect(res).toEqual(StatisticData);
      done();
    })
  });

  it('should return current quiz type statistic', () => {
    service['_userStatistic'] = [StatisticData];
    spyOn(sessionStorage, 'getItem').and.returnValue('{ "userId": "6281ff8cf79c2bc5b56a25da" }');
    const result = service.getStatisticData('Art', QuizResult);
    expect(result).toEqual(CurrentQuizTypeStatistic);
  });

  it('should return current user statistic', () => {
    service['_userStatistic'] = [StatisticData];
    const result = service.getCurrentStatisticData();
    expect(result).toEqual([StatisticData]);
  });

  it('should update statistic data if current quiz type exist', () => {
    service['_userStatistic'] = [StatisticData];
    service.updateCurrentStatisticData(StatisticData2);
    expect(service['_userStatistic']).toEqual([StatisticData2]);
  });

  it('should add new quiz type to statistic data if current quiz type does not exist', () => {
    service['_userStatistic'] = [StatisticData];
    service.updateCurrentStatisticData(StatisticData3);
    expect(service['_userStatistic']).toEqual([...[StatisticData], ...[StatisticData3]]);
  });

  it('should set user statistic', () => {
    service['_userStatistic'] = [StatisticData];
    service.setStatistic([StatisticData2]);
    expect(service['_userStatistic']).toEqual([StatisticData2]);
  });

  it('should return quizzesCount chart data if dataType is quizzesPlayed', () => {
    service['_userStatistic'] = [StatisticData];
    const result = service.getStatisticChartData('quizzesPlayed');
    expect(result).toEqual({ labels: ['Art'], datasets: [{ data: [StatisticData.quizzesCount] }] });
  });

  it('should return questionsCount chart data if dataType is correctAnswers', () => {
    service['_userStatistic'] = [StatisticData];
    const result = service.getStatisticChartData('correctAnswers');
    expect(result).toEqual({ labels: ['Art'], datasets: [{ data: [StatisticData.questionsCount] }] });
  });

  it('should return average pointsCount chart data if dataType is averagePoints', () => {
    service['_userStatistic'] = [StatisticData];
    const result = service.getStatisticChartData('averagePoints');
    const averagePoints = Math.floor(StatisticData.pointsCount / StatisticData.quizzesCount);
    expect(result).toEqual({ labels: ['Art'], datasets: [{ data: [averagePoints] }] });
  });

  it('should return average quizTimeCount chart data if dataType is averageTime', () => {
    service['_userStatistic'] = [StatisticData];
    const result = service.getStatisticChartData('averageTime');
    const milliseconds = StatisticData.quizTimeCount / StatisticData.quizzesCount;
    const averageTime = service['_convertMilliseconds'](milliseconds);
    expect(result).toEqual({ labels: ['Art'], datasets: [{ data: [averageTime] }] });
  });
});