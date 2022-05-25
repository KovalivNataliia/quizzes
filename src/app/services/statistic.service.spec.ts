import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StatisticData } from '@shared/test-data';
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
});