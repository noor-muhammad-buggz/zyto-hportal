import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'trim' })
export class TrimPipe implements PipeTransform {

    transform(value: string, args: string[]): any {
        if (!value) return value;
    
        return value.replace(/^\s+|\s+$/g, function(txt) {
            return '';
        });
      }

}
