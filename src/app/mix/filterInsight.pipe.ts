import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'filterInsight' })
export class FilterInsightPipe implements PipeTransform {

  transform(items: any[], filter:any): any {
    if (!items || !filter) {
        return items;
    }
    // console.clear();
    
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    if(items.length > 0 && items[0].Type){
      items = items.filter(item => item.Type.indexOf(filter.type) !== -1);
      if(filter.sort && filter.order){
        if(filter.sort == 'Name')
          items = _.orderBy(items, [item => item.Item.Name.toLowerCase()], [filter.order]);
        else
          items = _.orderBy(items, [item => item[filter.sort]], [filter.order]);
      }
    }

    return items
  }

}
