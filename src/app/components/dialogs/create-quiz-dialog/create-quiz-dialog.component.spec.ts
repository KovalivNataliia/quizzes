import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { QuizService } from '@services/quiz.service';
import { QuestionCount, QuizCategories } from '@shared/test-data';
import { of } from 'rxjs';

import { CreateQuizDialogComponent } from './create-quiz-dialog.component';

describe('CreateQuizDialogComponent', () => {
  let component: CreateQuizDialogComponent;
  let fixture: ComponentFixture<CreateQuizDialogComponent>;

  const mockQuizService = jasmine.createSpyObj(['getQuizCategories', 'getQuestionCount']);
  mockQuizService.getQuizCategories.and.returnValue(of(QuizCategories));
  mockQuizService.getQuestionCount.and.returnValue(of(QuestionCount));

  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatDialogModule
      ],
      declarations: [CreateQuizDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: QuizService, useValue: mockQuizService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign quizCategories value in constructor', () => {
    expect(component.quizCategories).toEqual(QuizCategories);
  });

  it('should close dialog after cancel func was called', () => {
    component.cancel();
    expect(dialogRefSpyObj.close).toHaveBeenCalled();
  });

  it('should get question count after getQuestionCount func was called', () => {
    component.getQuestionCount();
    expect(mockQuizService.getQuestionCount).toHaveBeenCalled();
  });

  it('should get max 50 question count', () => {
    component.quizDifficulty = 'medium';
    component.getQuestionCount();
    expect(component.maxQuestionCount).toBe(50);
  });
});
