import { Component, Input } from '@angular/core';

@Component({
  selector: 'dd-modal-footer',
  templateUrl: './dd-modal-footer.component.html',
  styleUrls: ['./dd-modal-footer.component.scss'],
})
export class DdModalFooterComponent {
  @Input() ddClass: string = 'default';
}
