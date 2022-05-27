import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewportScroller } from '@angular/common';

import { HeaderComponent } from './header.component';
import { ImagePathPipe } from '@pipes/image-path.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthorizationService } from '@services/authorization.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockAuthService = jasmine.createSpyObj(['logoutUser']);
  const viewportScrollerSpy = jasmine.createSpyObj(['scrollToPosition']);
  const routerSpy = {
    navigate: jasmine.createSpy('navigate'),
    events: of(new NavigationEnd(0, '/', '/'))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HeaderComponent, ImagePathPipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthorizationService, useValue: mockAuthService },
        { provide: ViewportScroller, useValue: viewportScrollerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign currentUrl value as home if url is undefined', () => {
    expect(component.currentUrl).toBe('home');
  });

  it('should logout user if logOut func was called', () => {
    component.logOut();
    expect(mockAuthService.logoutUser).toHaveBeenCalled();
  });

  it('should scroll to top if toTop func was called', (done: DoneFn) => {
    component.toTop();
    done();
    expect(viewportScrollerSpy.scrollToPosition).toHaveBeenCalledWith([0, 0]);
  });
});
