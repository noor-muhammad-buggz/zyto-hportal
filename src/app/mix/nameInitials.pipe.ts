import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nameInitials' })
export class NameInitialsPipe implements PipeTransform {

  transform(input: string): string {
    const textArray = input.split(' ');
    let letter = textArray[0].substr(0, 1) + '' + (textArray.length > 1 ? textArray[1].substr(0, 1) : '');
    letter = letter.toUpperCase();
    return letter;
  }
}
