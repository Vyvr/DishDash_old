import { Component, Input } from '@angular/core';

@Component({
  selector: 'dd-modal',
  templateUrl: './dd-modal.component.html',
  styleUrls: ['./dd-modal.component.scss'],
})

//@TODO finish this crap
export class DdModalComponent {
  @Input()
  isVisible: boolean = false;

  @Input()
  withHeader: boolean = false;

  @Input()
  headerText: string = '';

  closeModal(): void {
    this.isVisible = false;
  }
}
