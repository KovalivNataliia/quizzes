import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHTML'
})
export class DecodeHtmlPipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): unknown {
    let doc = new DOMParser().parseFromString(value!, "text/html");
    return doc.documentElement.textContent;
  }

}