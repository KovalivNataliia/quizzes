import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { StatisticService } from '@services/statistic.service';
import { StatisticData } from '@shared/test-data';
import { NgChartsModule } from 'ng2-charts';
import { of } from 'rxjs';

import { StatisticPageComponent } from './statistic-page.component';

describe('StatisticPageComponent', () => {
  let component: StatisticPageComponent;
  let fixture: ComponentFixture<StatisticPageComponent>;
  let debugEl: DebugElement;
  const mockStatisticService = jasmine.createSpyObj(['getUserStatistic', 'getStatisticChartData', 'setStatistic']);
  mockStatisticService.getUserStatistic = jasmine.createSpy().and.returnValue(of([StatisticData]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatTableModule, NgChartsModule],
      declarations: [StatisticPageComponent],
      providers: [
        { provide: StatisticService, useValue: mockStatisticService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticPageComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    component.dataSource = mockStatisticService.getUserStatistic();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleStatisticView func on toggle button click', () => {
    const event = spyOn(component, 'toggleStatisticView');
    component.isStatisticDataExist = true;
    fixture.detectChanges();
    const button = debugEl.query(By.css('.statistic-toggle-btn'));
    button.triggerEventHandler('click', null);
    expect(event).toHaveBeenCalled();
  });

  it('toggleBtnText value should be "Charts" if showStatisticTable was false before toggleStatisticView was called', () => {
    component.showStatisticTable = false;
    component.toggleStatisticView();
    expect(component.showStatisticTable).toBeTrue();
    expect(component.toggleBtnText).toBe('Charts');
  });

  it('toggleBtnText value should be "Table" if showStatisticTable was true before toggleStatisticView was called', () => {
    component.showStatisticTable = true;
    component.toggleStatisticView();
    expect(component.showStatisticTable).toBeFalse();
    expect(component.toggleBtnText).toBe('Table');
  });

  it('should get empty array if statistic does not exist', () => {
    mockStatisticService.getUserStatistic = jasmine.createSpy().and.returnValue(of(null));
    component.ngOnInit();
    expect(mockStatisticService.getUserStatistic).toHaveBeenCalled();
    expect(mockStatisticService.setStatistic).toHaveBeenCalledWith([]);
  });
});
