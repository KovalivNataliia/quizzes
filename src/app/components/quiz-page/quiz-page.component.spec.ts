import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { DecodeHtmlPipe } from '@pipes/decode-html.pipe';
import { DialogService } from '@services/dialog.service';
import { QuizService } from '@services/quiz.service';
import { StatisticService } from '@services/statistic.service';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { StateData, StatisticData } from '@shared/test-data';
import { BehaviorSubject, of } from 'rxjs';

import { QuizPageComponent } from './quiz-page.component';

describe('QuizPageComponent', () => {
  let component: QuizPageComponent;
  let fixture: ComponentFixture<QuizPageComponent>;
  let debugEl: DebugElement;
  const mockQuizService = jasmine.createSpyObj([
    'getState', 'nextQuestion', 'previousQuestion', 'getStateValue',
    'updateQuiz', 'changeTimesPlayedData', 'getQuizResult', 'getQuizType'
  ]);
  mockQuizService.getState.and.returnValue(new BehaviorSubject<QuizState>(StateData));
  mockQuizService.getStateValue.and.returnValue(StateData);
  mockQuizService.updateQuiz.and.returnValue(of({ message: 'Success' }));
  mockQuizService.getQuizType.and.returnValue('Random quiz');
  const mockDialogService = jasmine.createSpyObj(['openLeaveQuizDialog', 'openResultDialog']);
  mockDialogService.openResultDialog.and.returnValue(of(true));
  const mockStatisticService = jasmine.createSpyObj(['getStatisticData', 'updateUserStatistic', 'updateCurrentStatisticData']);
  mockStatisticService.getStatisticData.and.returnValue(StatisticData);
  mockStatisticService.updateUserStatistic.and.returnValue(of(StatisticData));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomePageComponent }]
      )],
      declarations: [QuizPageComponent, DecodeHtmlPipe],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: QuizService, useValue: mockQuizService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: StatisticService, useValue: mockStatisticService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPageComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
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

  it('should call showResults func on result button click', () => {
    const event = spyOn(component, 'showResults');
    const button = debugEl.query(By.css('.result-btn'));
    button.triggerEventHandler('click', null);
    expect(event).toHaveBeenCalled();
  });

  it('should update quiz data if quiz has id', () => {
    component.showResults();
    const state = mockQuizService.getStateValue();
    expect(state).toBe(StateData);
    expect(mockQuizService.updateQuiz).toHaveBeenCalledWith(state.currentQuizId);
    expect(mockQuizService.changeTimesPlayedData).toHaveBeenCalledWith(state.currentQuizId);
  });

  it('should save statistic data if user is logged in', () => {
    component['_isAuth$'] = new BehaviorSubject<boolean>(true);
    component.showResults();
    expect(mockStatisticService.getStatisticData).toHaveBeenCalled();
    expect(mockStatisticService.updateUserStatistic).toHaveBeenCalled();
    expect(mockStatisticService.updateCurrentStatisticData).toHaveBeenCalled();
  });

  it('should show result dialog on result button click', () => {
    component.showResults();
    expect(mockQuizService.getQuizResult).toHaveBeenCalled();
    expect(mockDialogService.openResultDialog).toHaveBeenCalled();
  });
});
