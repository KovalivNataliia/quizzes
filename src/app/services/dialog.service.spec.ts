import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateQuizDialogComponent } from '@components/dialogs/create-quiz-dialog/create-quiz-dialog.component';
import { LeaveQuizDialogComponent } from '@components/dialogs/leave-quiz-dialog/leave-quiz-dialog.component';
import { ResultDialogComponent } from '@components/dialogs/result-dialog/result-dialog.component';
import { QuizResult } from '@shared/test-data';
import { of } from 'rxjs';

import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;
  const quizResult = QuizResult;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule]
    })
    service = TestBed.inject(DialogService);
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open result dialog', () => {
    service.openResultDialog(quizResult);
    expect(dialogSpy).toHaveBeenCalledWith(ResultDialogComponent, { width: '500px', data: quizResult });
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('should open leave quiz dialog', () => {
    service.openLeaveQuizDialog();
    expect(dialogSpy).toHaveBeenCalledWith(LeaveQuizDialogComponent, { width: '350px' });
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('should open create quiz dialog', () => {
    service.openCreateQuizDialog();
    expect(dialogSpy).toHaveBeenCalledWith(CreateQuizDialogComponent, { width: '500px' });
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });
});