import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHTML'
})
export class DecodeHtmlPipe implements PipeTransform {

  transform(value: string | null): string | null {
    let doc = new DOMParser().parseFromString(value!, "text/html");
    return doc.documentElement.textContent;
  }

}