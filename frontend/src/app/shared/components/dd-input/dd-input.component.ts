import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { isNil } from 'lodash-es';

@Component({
  selector: 'dd-input',
  templateUrl: './dd-input.component.html',
  styleUrls: ['./dd-input.component.scss'],
})
export class DdInputComponent implements OnInit, AfterViewInit {
  private _inputValue: string = '';
  valueFromInput: string = '';

  @Input() title: string = '';
  @Input() type: 'input' | 'textarea' | 'number' = 'input';
  @Input() resizable: boolean = false;
  @Input()
  get inputValue(): string {
    return this._inputValue;
  }

  set inputValue(value: string) {
    this._inputValue = value;
    this.valueFromInput = value;
  }

  @Output() inputValueChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('resizableTextarea')
  resizableTextarea?: ElementRef<HTMLTextAreaElement>;

  ngOnInit(): void {
    this.valueFromInput = this.inputValue;
  }

  ngAfterViewInit(): void {
    this.resizeTextarea();
  }

  onInputChange(): void {
    this.inputValueChange.emit(this.valueFromInput);
  }

  resizeTextarea(): void {
    if (isNil(this.resizableTextarea)) {
      return;
    }

    const textarea = this.resizableTextarea.nativeElement;
    // Timeout to ensure the DOM has updated
    setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }
}
