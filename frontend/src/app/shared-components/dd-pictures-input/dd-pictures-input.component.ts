import { Component, EventEmitter, Input, Output } from '@angular/core';
import imageCompression from 'browser-image-compression';
import { Observable, from, mergeMap, toArray } from 'rxjs';

@Component({
  selector: 'dd-pictures-input',
  templateUrl: './dd-pictures-input.component.html',
  styleUrls: ['./dd-pictures-input.component.scss'],
})
export class DdPicturesInputComponent {
  images: string[] = [];

  @Output() imagesChange: EventEmitter<string[]> = new EventEmitter();

  //@TODO make some limits on picture sizes!!!

  
  // onFileSelected(event: any): void {
  //   const files: FileList = event.target.files;

  //   if (files.length === 0) return;

  //   Array.from(files).forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.images.push(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   });

  //   this.imagesChange.emit(this.images);
  // }


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length === 0) return;
    
    from(Array.from(files))
      .pipe(
        mergeMap((file: File) =>
          from(
            imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            })
          ).pipe(
            mergeMap(
              (compressedFile: Blob) =>
                new Observable<string>((observer) => {
                  const reader = new FileReader();
                  reader.onload = (e: any) => {
                    observer.next(e.target.result as string);
                    observer.complete();
                  };
                  reader.onerror = (error) => observer.error(error);
                  reader.readAsDataURL(compressedFile);
                })
            )
          )
        ),
        toArray()
      )
      .subscribe({
        next: (compressedImages: string[]) => {
          this.images = [...this.images, ...compressedImages];
          this.imagesChange.emit(this.images);
        },
        error: (error: any) =>
          console.error('Error compressing files: ', error),
      });
  }

  onDeleteImage(index: number): void {
    this.images.splice(index, 1);

    this.images.map(() => {});

    this.imagesChange.emit(this.images);
  }
}
