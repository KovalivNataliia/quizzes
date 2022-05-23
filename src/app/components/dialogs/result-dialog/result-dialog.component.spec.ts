import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConvertMillisecondsPipe } from '@pipes/convert-milliseconds.pipe';
import { QuizService } from '@services/quiz.service';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { StateData } from '@shared/test-data';
import { BehaviorSubject } from 'rxjs';

import { ResultDialogComponent } from './result-dialog.component';

describe('ResultDialogComponent', () => {
  let component: ResultDialogComponent;
  let fixture: ComponentFixture<ResultDialogComponent>;
  const mockQuizService = jasmine.createSpyObj(['getState']);
  mockQuizService.getState.and.returnValue(new BehaviorSubject<QuizState>(StateData));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: QuizService, useValue: mockQuizService },
      ],
      declarations: [ResultDialogComponent, ConvertMillisecondsPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign question count value', () => {
    component.questionCount$.subscribe(value => {
      expect(value).toBe(10);
    })
  });
});
