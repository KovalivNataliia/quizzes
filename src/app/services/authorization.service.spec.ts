import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserData, UserResData } from '@shared/test-data';
import { of } from 'rxjs';

import { AuthorizationService } from './authorization.service';
import { QuizService } from './quiz.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let mockQuizService: jasmine.SpyObj<QuizService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    mockQuizService = jasmine.createSpyObj(['resetQuizzes']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new AuthorizationService(httpClientSpy, mockQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(of(UserResData));
    service.registerUser(UserData).subscribe(res => {
      expect(res).toEqual(UserResData);
      done();
    })
  });

  it('should login user', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(of(UserResData));
    service.loginUser(UserData).subscribe(res => {
      expect(res).toEqual(UserResData);
      done();
    })
  });

  it('should set username value', (done: DoneFn) => {
    service.storeUser(UserData);
    done();
    service.username$.subscribe(username => {
      expect(username).toBe('user');
    })
  });

  it('should set isAuth value', (done: DoneFn) => {
    service.storeUser(UserData);
    done();
    service.isAuth$.subscribe(username => {
      expect(username).toBeTrue();
    })
  });

  it('should logout user', (done: DoneFn) => {
    service.logoutUser();
    done();
    service.isAuth$.subscribe(auth => {
      expect(auth).toBeFalse();
    })
  });

  it('should reset quizzes', (done: DoneFn) => {
    service.logoutUser();
    done();
    expect(mockQuizService.resetQuizzes).toHaveBeenCalled();
  });
});