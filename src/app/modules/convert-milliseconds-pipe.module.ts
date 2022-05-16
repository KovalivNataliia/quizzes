import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertMillisecondsPipe } from '@pipes/convert-milliseconds.pipe';


@NgModule({
  declarations: [ConvertMillisecondsPipe],
  imports: [CommonModule],
  exports: [ConvertMillisecondsPipe]
})
export class ConvertMillisecondsPipeModule { }