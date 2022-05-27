import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { QuizService } from '@services/quiz.service';
import { StatisticService } from '@services/statistic.service';
import { CreateQuizData, QuizAnswers, QuizData, StatisticData } from '@shared/test-data';
import { BehaviorSubject, of } from 'rxjs';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  const mockQuizService = jasmine.createSpyObj([
    'getRandomQuiz', 'getQuizzes', 'getDefaultQuizzes',
    'shuffleAnswers', 'setState', 'updateQuizzes', 'searchQuiz', 'sortQuizzes',
    'getUserQuizzesData', 'getUserQuizzes', 'updateQuizzes', 'getQuiz', 'addQuiz',
    'removeQuiz'
  ]);
  mockQuizService.getRandomQuiz.and.returnValue(of(QuizData.quiz));
  mockQuizService.getQuizzes.and.returnValue([QuizData]);
  mockQuizService.getDefaultQuizzes.and.returnValue(of({ message: 'Success', quizzes: [QuizData] }));
  mockQuizService.shuffleAnswers.and.returnValue(QuizAnswers);
  mockQuizService.searchQuiz.and.returnValue([QuizData]);
  mockQuizService.sortQuizzes.and.returnValue([QuizData]);
  mockQuizService.getUserQuizzes.and.returnValue(of({ message: 'Success', userQuizzes: [QuizData] }));
  mockQuizService.getQuiz.and.returnValue(of([QuizData]));
  mockQuizService.addQuiz.and.returnValue(of({ message: 'Success', quiz: [QuizData] }));
  mockQuizService.removeQuiz.and.returnValue(of({ message: 'Success'}));
  
  const mockStatisticService = jasmine.createSpyObj(['getUserStatistic', 'setStatistic', 'getCurrentStatisticData']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [HomePageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: QuizService, useValue: mockQuizService },
        { provide: StatisticService, useValue: mockStatisticService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    mockStatisticService.getUserStatistic = jasmine.createSpy().and.returnValue(of([StatisticData]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get default quizzes if user is auth and no user quizzes', () => {
    mockQuizService.getUserQuizzesData = jasmine.createSpy().and.returnValue(null);
    component['_isAuth$'] = new BehaviorSubject<boolean>(true);
    spyOn(sessionStorage, 'getItem').and.returnValue('{ "userId": "1" }')
    component.ngOnInit();
    expect(mockQuizService.getDefaultQuizzes).toHaveBeenCalled();
  });

  it('should get user quizzes if user is auth and no user quizzes', () => {
    mockQuizService.getUserQuizzesData = jasmine.createSpy().and.returnValue(null);
    mockQuizService.getQuizzes = jasmine.createSpy().and.returnValue([]);
    component['_isAuth$'] = new BehaviorSubject<boolean>(true);
    spyOn(sessionStorage, 'getItem').and.returnValue('{ "userId": "1" }')
    component.ngOnInit();
    expect(mockQuizService.getUserQuizzes).toHaveBeenCalled();
    expect(mockQuizService.updateQuizzes).toHaveBeenCalled();
  });

  it('should get user statistic if user is auth and no user statistic', () => {
    mockQuizService.getUserQuizzesData = jasmine.createSpy().and.returnValue(null);
    mockQuizService.getQuizzes = jasmine.createSpy().and.returnValue([]);
    component['_isAuth$'] = new BehaviorSubject<boolean>(true);
    spyOn(sessionStorage, 'getItem').and.returnValue('{ "userId": "1" }');
    component.ngOnInit();
    expect(mockQuizService.getUserQuizzes).toHaveBeenCalled();
    expect(mockQuizService.updateQuizzes).toHaveBeenCalled();
  });

  it('should get empty array if statistic does not exist', () => {
    mockStatisticService.getUserStatistic = jasmine.createSpy().and.returnValue(of(null));
    component['_isAuth$'] = new BehaviorSubject<boolean>(true);
    spyOn(sessionStorage, 'getItem').and.returnValue('{ "userId": "1" }');
    component.ngOnInit();
    expect(mockStatisticService.getUserStatistic).toHaveBeenCalled();
    expect(mockStatisticService.setStatistic).toHaveBeenCalledWith([]);
  });

  it('should get random quiz after playRandomQuiz func was called', (done: DoneFn) => {
    component.playRandomQuiz();
    done();
    expect(mockQuizService.getRandomQuiz).toHaveBeenCalled();
    expect(mockQuizService.shuffleAnswers).toHaveBeenCalledWith(QuizData.quiz);
    expect(mockQuizService.setState).toHaveBeenCalled();
  });

  it('should start new quiz after playQuiz func was called', (done: DoneFn) => {
    component.playQuiz(QuizData);
    done();
    expect(mockQuizService.shuffleAnswers).toHaveBeenCalledWith(QuizData.quiz);
    expect(mockQuizService.setState).toHaveBeenCalled();
  });

  it('should search quizzes by text', () => {
    const event = { text: 'text' };
    component.searchByQuizName(event);
    expect(mockQuizService.searchQuiz).toHaveBeenCalledWith('text');
  });

  it('should sort quizzes by selectedValue', () => {
    const event = { selectedValue: 'name' };
    component.sortQuizzes(event);
    expect(mockQuizService.sortQuizzes).toHaveBeenCalledWith('name');
  });

  it('should not sort quizzes if no selectedValue', () => {
    mockQuizService.sortQuizzes.calls.reset();
    const event = { selectedValue: '' };
    component.sortQuizzes(event);
    expect(mockQuizService.sortQuizzes).not.toHaveBeenCalled();
  });

  it('should create quiz', () => {
    const event = CreateQuizData;
    component.createQuiz(event);
    expect(mockQuizService.getQuiz).toHaveBeenCalledWith(event);
    expect(mockQuizService.addQuiz).toHaveBeenCalledWith(component['_quizData']);
    expect(mockQuizService.updateQuizzes).toHaveBeenCalledWith(component.quizzes);
  });

  it('should update quizzes after removing if it is search mode', () => {
    const event = { quizId: '1' };
    component.searchMode = true;
    component['_preservedQuizzes'] = [QuizData];
    component.removeQuiz(event);
    expect(mockQuizService.updateQuizzes).toHaveBeenCalledWith([QuizData]);
  });

  it('should update quizzes after removing if it is sort mode', () => {
    const event = { quizId: '1' };
    component['_sortValue'] = 'name';
    component['_preservedQuizzes'] = [QuizData];
    component.removeQuiz(event);
    expect(mockQuizService.updateQuizzes).toHaveBeenCalledWith([QuizData]);
  });

  it('should off search mode after goBack func was called', () => {
    component.searchMode = true;
    component.goBack();
    expect(component.searchMode).toBeFalse();
  });
});
