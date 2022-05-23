import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizData } from '@shared/test-data';

import { QuizCardComponent } from './quiz-card.component';

describe('QuizCardComponent', () => {
  let component: QuizCardComponent;
  let fixture: ComponentFixture<QuizCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCardComponent);
    component = fixture.componentInstance;
    component.quizData = QuizData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on click play quiz button', () => {
    const quizData = component.quizData;
    const event = spyOn(component.emitPlayQuiz, 'emit');
    component.playQuiz(quizData);
    expect(event).toHaveBeenCalledWith(quizData);
  });

  it('should emit on click remove quiz button', () => {
    const quizId = component.quizData._id;
    const event = spyOn(component.emitRemoveQuiz, 'emit');
    component.removeQuiz(quizId);
    expect(event).toHaveBeenCalledWith({ quizId });
  });
});
