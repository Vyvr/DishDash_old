import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dd-input',
  templateUrl: './dd-input.component.html',
  styleUrls: ['./dd-input.component.scss']
})
export class DdInputComponent {
  private _inputValue: string = '';
  valueFromInput: string = '';
  
  @Input() title: string = '';
  @Input() type: 'input' | 'textarea' = 'input';
  @Input()
  get inputValue(): string {
    return this._inputValue;
  }

  set inputValue(value: string) {
    this._inputValue = value;
    this.valueFromInput = value;
  }

  @Output() inputValueChange: EventEmitter<string> = new EventEmitter();

  
  ngOnInit() {
    this.valueFromInput = this.inputValue;
  }

  onInputChange(): void {
    this.inputValueChange.emit(this.valueFromInput);
  }
}
