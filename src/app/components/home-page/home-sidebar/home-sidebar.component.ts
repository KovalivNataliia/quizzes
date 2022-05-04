import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.scss']
})
export class HomeSidebarComponent {

  @Output() emitSearchByQuizName: EventEmitter<{text: string}> = new EventEmitter();
  text: string = '';

  searchByQuizName(text: string): void {
    this.text = '';
    this.emitSearchByQuizName.emit({text});
  }

}
