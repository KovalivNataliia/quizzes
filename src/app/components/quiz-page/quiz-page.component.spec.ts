import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DecodeHtmlPipe } from '@pipes/decode-html.pipe';
import { DialogService } from '@services/dialog.service';
import { QuizService } from '@services/quiz.service';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { StateData } from '@shared/test-data';
import { BehaviorSubject } from 'rxjs';

import { QuizPageComponent } from './quiz-page.component';

describe('QuizPageComponent', () => {
  let component: QuizPageComponent;
  let fixture: ComponentFixture<QuizPageComponent>;
  const mockQuizService = jasmine.createSpyObj([
    'getState', 'nextQuestion', 'previousQuestion', 'getStateValue'
  ]);
  mockQuizService.getState.and.returnValue(new BehaviorSubject<QuizState>(StateData));
  mockQuizService.getStateValue.and.returnValue(StateData);
  const mockDialogService = jasmine.createSpyObj(['openLeaveQuizDialog']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [QuizPageComponent, DecodeHtmlPipe],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: QuizService, useValue: mockQuizService },
        { provide: DialogService, useValue: mockDialogService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPageComponent);
    component = fixture.componentInstance;
    StateData.isQuizDataSaved = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign question count value', (done: DoneFn) => {
    const questionCount = StateData.currentQuiz.length;
    component.questionCount$.subscribe(value => {
      expect(value).toBe(questionCount);
      done();
    })
  });

  it('should assign current question index value', (done: DoneFn) => {
    const currentQuestionIndex = StateData.currentQuestionIndex;
    component.currentQuestionIndex$.subscribe(value => {
      expect(value).toBe(currentQuestionIndex);
      done();
    })
  });

  it('should assign current question value', (done: DoneFn) => {
    const currentQuestion = StateData.currentQuiz[StateData.currentQuestionIndex].question;
    component.currentQuestion$.subscribe(value => {
      expect(value).toBe(currentQuestion);
      done();
    })
  });

  it('should assign question count value', (done: DoneFn) => {
    const currentAnswers = StateData.currentAnswers;
    component.currentAnswers$.subscribe(value => {
      expect(value).toBe(currentAnswers);
      done();
    })
  });

  it('should call next question method on press next question button', () => {
    component.nextQuestion();
    expect(mockQuizService.nextQuestion).toHaveBeenCalled();
  });

  it('should call previous question method on press previous question button', () => {
    component.previousQuestion();
    expect(mockQuizService.previousQuestion).toHaveBeenCalled();
  });

  it('should set user answer', () => {
    const state = mockQuizService.getStateValue();
    component.setAnswer('answer');
    expect(component.userAnswers[state.currentQuestionIndex]).toBe('answer');
  });

  it('canDeactivate func should return true if quiz data saved', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('canDeactivate func should return true if quiz data is not saved and dialog returned true', () => {
    StateData.isQuizDataSaved = false;
    mockDialogService.openLeaveQuizDialog.and.returnValue(true);
    expect(component.canDeactivate()).toBeTrue();
  });

  it('canDeactivate func should return false if quiz data is not saved and dialog returned false', () => {
    StateData.isQuizDataSaved = false;
    mockDialogService.openLeaveQuizDialog.and.returnValue(false);
    expect(component.canDeactivate()).toBeFalse();
  });
});
