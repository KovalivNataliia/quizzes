import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DecodeHtmlPipe } from '@pipes/decode-html.pipe';
import { QuizService } from '@services/quiz.service';
import { QuizState } from '@shared/interfaces/quizState.interface';
import { StateData } from '@shared/test-data';
import { BehaviorSubject, map } from 'rxjs';

import { QuizPageComponent } from './quiz-page.component';

describe('QuizPageComponent', () => {
  let component: QuizPageComponent;
  let fixture: ComponentFixture<QuizPageComponent>;
  const mockQuizService = jasmine.createSpyObj(['getState', 'nextQuestion', 'previousQuestion']);
  mockQuizService.getState.and.returnValue(new BehaviorSubject<QuizState>(StateData));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [QuizPageComponent, DecodeHtmlPipe],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: QuizService, useValue: mockQuizService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign question count value', () => {
    const questionCount = StateData.currentQuiz.length;
    component.questionCount$.subscribe(value => {
      expect(value).toBe(questionCount);
    })
  });

  it('should assign current question index value', () => {
    const currentQuestionIndex = StateData.currentQuestionIndex;
    component.currentQuestionIndex$.subscribe(value => {
      expect(value).toBe(currentQuestionIndex);
    })
  });

  it('should assign current question value', () => {
    const currentQuestion = StateData.currentQuiz[StateData.currentQuestionIndex].question;
    component.currentQuestion$.subscribe(value => {
      expect(value).toBe(currentQuestion);
    })
  });

  it('should assign question count value', () => {
    const currentAnswers = StateData.currentAnswers;
    component.currentAnswers$.subscribe(value => {
      expect(value).toBe(currentAnswers);
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
});
