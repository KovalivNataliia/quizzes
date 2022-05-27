import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthorizationPageComponent } from './authorization-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StatisticService } from '@services/statistic.service';
import { AuthorizationService } from '@services/authorization.service';
import { of } from 'rxjs';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { StatisticData } from '@shared/test-data';
import { Router } from '@angular/router';

describe('AuthorizationPageComponent', () => {
  let component: AuthorizationPageComponent;
  let fixture: ComponentFixture<AuthorizationPageComponent>;
  const formBuilder = new FormBuilder();

  const mockAuthService = jasmine.createSpyObj(['registerUser', 'loginUser', 'storeUser']);
  mockAuthService.registerUser.and.returnValue(of({ message: 'Success' }));
  mockAuthService.loginUser.and.returnValue(of({ message: 'Success' }));

  const mockStatisticService = jasmine.createSpyObj(['getUserStatistic', 'setStatistic']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'authorization', component: AuthorizationPageComponent },
            { path: 'home', component: HomePageComponent },
          ]
        ),
        HttpClientTestingModule
      ],
      declarations: [AuthorizationPageComponent],
      providers: [
        { provide: AuthorizationService, useValue: mockAuthService },
        { provide: StatisticService, useValue: mockStatisticService },
        { provide: FormBuilder, useValue: formBuilder },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationPageComponent);
    component = fixture.componentInstance;
    mockStatisticService.getUserStatistic = jasmine.createSpy().and.returnValue(of(StatisticData));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register user if isRegistration value is true', () => {
    component.isRegistration = true;
    component.onSubmit();
    expect(mockAuthService.registerUser).toHaveBeenCalledWith(component.form.value);
  });

  it('should login user if isRegistration value is false', () => {
    component.isRegistration = false;
    component.onSubmit();
    expect(mockAuthService.loginUser).toHaveBeenCalledWith(component.form.value);
    expect(mockAuthService.storeUser).toHaveBeenCalled();
  });

  it('should get user statistic after authorization', () => {
    component.isRegistration = false;
    component.onSubmit();
    expect(mockStatisticService.getUserStatistic).toHaveBeenCalled();
    expect(mockStatisticService.setStatistic).toHaveBeenCalledWith(StatisticData);
  });

  it('should get empty array if statistic does not exist', () => {
    component.isRegistration = false;
    mockStatisticService.getUserStatistic = jasmine.createSpy().and.returnValue(of(null));
    component.onSubmit();
    expect(mockStatisticService.getUserStatistic).toHaveBeenCalled();
    expect(mockStatisticService.setStatistic).toHaveBeenCalledWith([]);
  });

  it('should assign auth values if it is authorization page', () => {
    const router = TestBed.inject(Router);
    const mockUrlTree = router.parseUrl('/authorization');
    // @ts-ignore: force this private property value for testing.
    router.currentUrlTree = mockUrlTree;
    component['_buildPage']();
    expect(component.isRegistration).toBeFalse();
    expect(component.title).toBe('Log In');
    expect(component.buttonText).toBe('Login');
  });

  it('should assign auth form group if isRegistration value is false', () => {
    component.isRegistration = false;
    const event = spyOn(formBuilder, 'group').and.returnValue(new FormGroup({}));
    component['_buildForm']();
    expect(event).toHaveBeenCalled();
    expect(component.form).toBeDefined();
  });

  it('should assign register form group if isRegistration value is true', () => {
    component.isRegistration = true;
    const event = spyOn(formBuilder, 'group').and.returnValue(new FormGroup({}));
    component['_buildForm']();
    expect(event).toHaveBeenCalled();
    expect(component.form).toBeDefined();
  });
});
