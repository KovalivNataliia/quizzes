import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { LeaveQuizDialogComponent } from './leave-quiz-dialog.component';

describe('LeaveQuizDialogComponent', () => {
  let component: LeaveQuizDialogComponent;
  let fixture: ComponentFixture<LeaveQuizDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveQuizDialogComponent],
      imports: [MatDialogModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveQuizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
