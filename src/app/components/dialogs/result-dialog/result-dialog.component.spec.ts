import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConvertMillisecondsPipe } from '@pipes/convert-milliseconds.pipe';
import { QuizService } from '@services/quiz.service';

import { ResultDialogComponent } from './result-dialog.component';

describe('ResultDialogComponent', () => {
  let component: ResultDialogComponent;
  let fixture: ComponentFixture<ResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: QuizService },
      ],
      declarations: [ResultDialogComponent, ConvertMillisecondsPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
