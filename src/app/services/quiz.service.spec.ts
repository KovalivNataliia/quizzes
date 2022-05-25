import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateQuizData, QuestionCount, QuizCategories, QuizData, QuizItems, QuizResData } from '@shared/test-data';
import { of } from 'rxjs';

import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let service: QuizService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    service = new QuizService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('resetQuizzes func should reset quizzes data', () => {
    service.resetQuizzes();
    expect(service.userQuizzes).toBeNull();
  });

  it('should return random quiz', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of({ results: QuizItems }));
    service.getRandomQuiz().subscribe(res => {
      expect(res).toEqual(QuizItems);
      done();
    })
  });

  it('should return quiz categories', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of({ trivia_categories: QuizCategories }));
    service.getQuizCategories().subscribe(res => {
      expect(res).toEqual(QuizCategories);
      done();
    })
  });

  it('should return question count', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of({ category_question_count: QuestionCount }));
    service.getQuestionCount('id').subscribe(res => {
      expect(res).toEqual(QuestionCount);
      done();
    })
  });

  it('should return quiz', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of({ results: QuizItems }));
    service.getQuiz(CreateQuizData).subscribe(res => {
      expect(res).toEqual(QuizItems);
      done();
    })
  });

  it('should return default quizzes', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of(QuizResData));
    service.getDefaultQuizzes().subscribe(res => {
      expect(res).toEqual(QuizResData);
      done();
    })
  });

  it('should return user quizzes', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of(QuizResData));
    service.getUserQuizzes('id').subscribe(res => {
      expect(res).toEqual(QuizResData);
      done();
    })
  });

  it('should add quiz', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(of(QuizResData));
    service.addQuiz(QuizData).subscribe(res => {
      expect(res).toEqual(QuizResData);
      done();
    })
  });

  it('should update quiz', (done: DoneFn) => {
    httpClientSpy.patch.and.returnValue(of(QuizResData));
    service.updateQuiz('id').subscribe(res => {
      expect(res).toEqual(QuizResData);
      done();
    })
  });

  it('should remove quiz', (done: DoneFn) => {
    httpClientSpy.delete.and.returnValue(of(QuizResData));
    service.removeQuiz('id').subscribe(res => {
      expect(res).toEqual(QuizResData);
      done();
    })
  });
});