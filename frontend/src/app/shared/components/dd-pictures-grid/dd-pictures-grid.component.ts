import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dd-pictures-grid',
  templateUrl: './dd-pictures-grid.component.html',
  styleUrls: ['./dd-pictures-grid.component.scss'],
})
export class DdPicturesGridComponent{
  @Input() images?: string[] | null = [];
  @Input() itemsCount: number = 0;
}
