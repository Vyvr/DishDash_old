import { Component, Input } from '@angular/core';

@Component({
  selector: 'dd-requesting-spinner',
  templateUrl: './dd-requesting-spinner.component.html',
  styleUrls: ['./dd-requesting-spinner.component.scss'],
})
export class DdRequestingSpinnerComponent {
  @Input() 
   isLoading: boolean | undefined = true;

  get IsLoading(): boolean {
    return this.isLoading ? true : false;
  }
}
