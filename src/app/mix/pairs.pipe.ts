import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pairs' })
export class PairsPipe implements PipeTransform {
  transform(value:any) {
      console.log(value);
    return value.filter((v,i) => i%4==0).map((v,i) => [value[i], value[i*4+1]])
  }
}