import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dd-pictures-input',
  templateUrl: './dd-pictures-input.component.html',
  styleUrls: ['./dd-pictures-input.component.scss'],
})
export class DdPicturesInputComponent {
  foodImages: string[] = [];

  @Input()
  get inputImages(): string[] {
    return this.foodImages;
  }

  set inputImages(value: string[]) {
    this.foodImages = value;
  }

  @Output() inputImagesChange: EventEmitter<string[]> = new EventEmitter();

  ngOnInit() {
    this.foodImages = this.inputImages;
  }

  onInputChange(): void {
    this.inputImagesChange.emit(this.foodImages);
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.foodImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  deleteImage(index: number): void {
    this.foodImages.splice(index, 1);
  }
}
