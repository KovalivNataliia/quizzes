import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMilliseconds'
})
export class convertMillisecondsPipe implements PipeTransform {

  transform(milliseconds: number, ...args: unknown[]): unknown {
    const padToTwoDigits = (number: number) => {
      return number.toString().padStart(2, '0');
    }
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return `${padToTwoDigits(minutes)} : ${padToTwoDigits(seconds)}`;
  }

}