import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss']
})
export class HomeSidebarComponent {

  @Output() emitSearchByQuizName: EventEmitter<{text: string}> = new EventEmitter();
  @Output() emitSortQuizzes: EventEmitter<{selectedValue: string}> = new EventEmitter();
  public text: string = '';
  public selectedValue: string = '';

  public searchByQuizName(): void {
    const emitData = {text: this.text};
    this.emitSearchByQuizName.emit(emitData);
    this.text = '';
  }

  public sortQuizzes(): void {
    const emitData = {selectedValue: this.selectedValue};
    this.emitSortQuizzes.emit(emitData);
  }

}
