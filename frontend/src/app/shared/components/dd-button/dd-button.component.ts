import { Component, Input } from '@angular/core';

@Component({
  selector: 'dd-button',
  templateUrl: './dd-button.component.html',
  styleUrls: ['./dd-button.component.scss'],
})
export class DdButtonComponent {
  @Input() ddClass: string = 'default';
  @Input() ddText: string = '';
}
