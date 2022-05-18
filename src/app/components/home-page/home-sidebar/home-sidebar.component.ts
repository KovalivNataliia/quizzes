import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AuthorizationService } from '@services/authorization.service';
import { DialogService } from '@services/dialog.service';
import { CreateQuizData } from '@shared/interfaces/createQuizData.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss']
})
export class HomeSidebarComponent implements OnDestroy {

  @Output() emitSearchByQuizName: EventEmitter<{ text: string }> = new EventEmitter();
  @Output() emitSortQuizzes: EventEmitter<{ selectedValue: string }> = new EventEmitter();
  @Output() emitCreateQuiz: EventEmitter<CreateQuizData> = new EventEmitter();
  @Input() public searchMode!: boolean;

  public text = '';
  public selectedValue = '';
  public isAuth$ = this.authService.isAuth$;
  private _subscriptions = new Subscription();

  constructor(
    private dialogService: DialogService,
    private authService: AuthorizationService,
    private router: Router
  ) { }

  public searchByQuizName(): void {
    const emitData = { text: this.text };
    this.emitSearchByQuizName.emit(emitData);
    this.text = '';
    this.selectedValue = '';
  }

  public sortQuizzes(): void {
    const emitData = { selectedValue: this.selectedValue };
    this.emitSortQuizzes.emit(emitData);
  }

  public createQuiz(): void {
    this._subscriptions.add(
      this.dialogService.openCreateQuizDialog().subscribe(result => {
        this.emitCreateQuiz.emit(result);
      })
    );
  }

  public showStatistic(): void {
    this.router.navigate(['/statistic']);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
