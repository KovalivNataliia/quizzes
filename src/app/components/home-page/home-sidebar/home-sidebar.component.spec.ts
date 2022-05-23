import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogService } from '@services/dialog.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { HomeSidebarComponent } from './home-sidebar.component';
import { CreateQuizData } from '@shared/test-data';

describe('HomeSidebarComponent', () => {
  let component: HomeSidebarComponent;
  let fixture: ComponentFixture<HomeSidebarComponent>;
  const createQuizData = CreateQuizData;
  const mockDialogService = jasmine.createSpyObj(['openCreateQuizDialog']);
  mockDialogService.openCreateQuizDialog.and.returnValue(of(createQuizData));
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      declarations: [HomeSidebarComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: DialogService, useValue: mockDialogService },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit text on click search quiz button', () => {
    const text = 'test';
    component.text = text;
    const event = spyOn(component.emitSearchByQuizName, 'emit');
    component.searchByQuizName();
    expect(event).toHaveBeenCalledWith({ text });
    expect(component.text).toBe('');
    expect(component.selectedValue).toBe('');
  });

  it('should emit selected sort value on change sort value', () => {
    const selectedValue = 'name';
    component.selectedValue = selectedValue;
    const event = spyOn(component.emitSortQuizzes, 'emit');
    component.sortQuizzes();
    expect(event).toHaveBeenCalledWith({ selectedValue });
  });

  it('should emit create quiz data on click create quiz button', () => {
    const event = spyOn(component.emitCreateQuiz, 'emit');
    component.createQuiz();
    mockDialogService.openCreateQuizDialog().subscribe(() => createQuizData);
    expect(event).toHaveBeenCalledWith(createQuizData);
  });

  it('should navigate to statistic page on click show statistic button', () => {
    component.showStatistic();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/statistic']);
  });
});
