import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dd-pictures-input',
  templateUrl: './dd-pictures-input.component.html',
  styleUrls: ['./dd-pictures-input.component.scss'],
})
export class DdPicturesInputComponent {
  images: string[] = [];

  @Output() imagesChange: EventEmitter<string[]> = new EventEmitter();

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    this.imagesChange.emit(this.images);
  }

  onDeleteImage(index: number): void {
    this.images.splice(index, 1);

    this.images.map(() => {
      
    })

    this.imagesChange.emit(this.images);
  }
}
