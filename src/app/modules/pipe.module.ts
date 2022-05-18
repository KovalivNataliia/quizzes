import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertMillisecondsPipe } from '@pipes/convert-milliseconds.pipe';
import { DecodeHtmlPipe } from '@pipes/decode-html.pipe';
import { ImagePathPipe } from '@pipes/image-path.pipe';


@NgModule({
  declarations: [
    ConvertMillisecondsPipe,
    DecodeHtmlPipe,
    ImagePathPipe
  ],
  imports: [CommonModule],
  exports: [
    ConvertMillisecondsPipe,
    DecodeHtmlPipe,
    ImagePathPipe
  ]
})
export class PipeModule { }