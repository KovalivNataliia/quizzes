import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHTML'
})
export class DecodeHtmlPipe implements PipeTransform {

  transform(value: string | null): string | null {
    const doc = new DOMParser().parseFromString(value!, "text/html");
    return doc.documentElement.textContent;
  }

}