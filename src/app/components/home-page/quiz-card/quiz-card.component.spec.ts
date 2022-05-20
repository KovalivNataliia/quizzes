import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCardComponent } from './quiz-card.component';

describe('QuizCardComponent', () => {
  let component: QuizCardComponent;
  let fixture: ComponentFixture<QuizCardComponent>;
  const quizData = {
    "_id": "62879a4c849f2ad032c01f59",
    "userId": "6281ff8cf79c2bc5b56a25da",
    "quizName": "Sports",
    "pointsPerQuestion": 30,
    "timesPlayed": 0,
    "createdByUser": true,
    "quiz": [
      {
        "category": "Sports",
        "type": "multiple",
        "difficulty": "easy",
        "question": "What team did England beat to win in the 1966 World Cup final?",
        "correct_answer": "West Germany",
        "incorrect_answers": ["Soviet Union", "Portugal", "Brazil"],
        "_id": "62879a4c849f2ad032c01f5a"
      }
    ]
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizCardComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCardComponent);
    component = fixture.componentInstance;
    component.quizData = quizData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
