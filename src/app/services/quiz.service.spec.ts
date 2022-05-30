import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { QuizState } from '@shared/interfaces/quizState.interface';
import {
  CreateQuizData, QuestionCount, QuizAnswers, QuizCategories, QuizData,
  QuizData2, QuizItems, QuizResData, QuizzesSortingData, SortedQuizzes,
  StateData, StateData2, StateData3
} from '@shared/test-data';
import { BehaviorSubject, of } from 'rxjs';

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

  it('should return quizzes', () => {
    service['_quizzes'] = [QuizData];
    const result = service.getQuizzes();
    expect(result).toEqual([QuizData]);
  });

  it('should update quizzes', () => {
    service['_quizzes'] = [QuizData];
    service.updateQuizzes([QuizData2]);
    expect(service['_quizzes']).toEqual([QuizData2]);
  });

  it('should return state', () => {
    service['_state$'] = new BehaviorSubject<QuizState>(StateData);
    const result = service.getState();
    expect(result).toEqual(new BehaviorSubject<QuizState>(StateData));
  });

  it('should return state value', () => {
    service['_state$'] = new BehaviorSubject<QuizState>(StateData);
    const result = service.getStateValue();
    expect(result).toEqual(StateData);
  });

  it('should set state', () => {
    service['_state$'] = new BehaviorSubject<QuizState>(StateData);
    service.setState(StateData2);
    expect(service['_state$']).toEqual(new BehaviorSubject<QuizState>(StateData2));
  });

  it('should set state for next question', () => {
    service['_state$'] = new BehaviorSubject<QuizState>(StateData2);
    service.answers = QuizAnswers;
    service.nextQuestion();
    service['_state$'].subscribe(state => {
      expect(state.currentAnswers).toEqual(StateData3.currentAnswers);
    })
  });

  it('should set state for previous question', () => {
    service['_state$'] = new BehaviorSubject<QuizState>(StateData3);
    service.answers = QuizAnswers;
    service.previousQuestion();
    service['_state$'].subscribe(state => {
      expect(state.currentAnswers).toEqual(StateData2.currentAnswers);
    })
  });

  it('should get quiz result', () => {
    service['_state$'] = new BehaviorSubject<QuizState>(StateData3);
    const result = service.getQuizResult(['Ned Stark']);
    expect(result.questionsCount).toBe(1);
    expect(result.pointsCount).toBe(100);
  });

  it('should shuffle answers', () => {
    spyOn(Math, 'random').and.returnValue(0.9);
    const result = service.shuffleAnswers(StateData3.currentQuiz);
    const expectedResult = [["Mario", "Zelda", "Pit", "Ned Stark"]];
    expect(result).toEqual(expectedResult);
  });

  it('should return filtered quizzes', () => {
    service['_quizzes'] = [QuizData];
    const result = service.searchQuiz('text');
    expect(result).toEqual([]);
  });

  it('should sort quizzes by quizName if selectedValue is name', () => {
    service['_quizzes'] = QuizzesSortingData;
    const result = service.sortQuizzes('name');
    expect(result).toEqual(SortedQuizzes);
  });

  it('should sort quizzes by pointsPerQuestion if selectedValue is points', () => {
    service['_quizzes'] = QuizzesSortingData;
    const result = service.sortQuizzes('points');
    expect(result).toEqual(SortedQuizzes);
  });

  it('should sort quizzes by quiz length if selectedValue is questions', () => {
    service['_quizzes'] = QuizzesSortingData;
    const result = service.sortQuizzes('questions');
    expect(result).toEqual(SortedQuizzes);
  });

  it('should sort quizzes by timesPlayed if selectedValue is playedTimes', () => {
    service['_quizzes'] = QuizzesSortingData;
    const result = service.sortQuizzes('playedTimes');
    expect(result).toEqual(SortedQuizzes);
  });

  it('should return default quizzes if no selectedValue', () => {
    service['_quizzes'] = QuizzesSortingData;
    const result = service.sortQuizzes('');
    expect(result).toEqual(QuizzesSortingData);
  });

  it('should change times played value', () => {
    service['_quizzes'] = [QuizData];
    service.changeTimesPlayedData('62879a4c849f2ad032c01f59');
    expect(QuizData.timesPlayed).toBe(1);
  });

  it('should return quiz type', () => {
    service['_quizzes'] = [QuizData];
    const result = service.getQuizType('62879a4c849f2ad032c01f59');
    expect(result).toBe('Sports');
  });

  it('should return random quiz type if no quiz found', () => {
    service['_quizzes'] = [QuizData];
    const result = service.getQuizType('1');
    expect(result).toBe('Random quiz');
  });
});