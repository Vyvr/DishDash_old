import { Pipe, PipeTransform } from '@angular/core';
import { Plugins } from './header.enums';

@Pipe({
  name: 'routePipe',
})
export class RoutePipe implements PipeTransform {
  transform(value: Plugins, selectedPlugin: string): boolean {
    return value.includes(selectedPlugin);
  }
}
