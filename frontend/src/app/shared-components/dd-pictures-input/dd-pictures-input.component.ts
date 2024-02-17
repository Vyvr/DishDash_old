import { Component, EventEmitter, Output } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import imageCompression from 'browser-image-compression';
import { Observable, combineLatest, from, mergeMap } from 'rxjs';

@Component({
  selector: 'dd-pictures-input',
  templateUrl: './dd-pictures-input.component.html',
  styleUrls: ['./dd-pictures-input.component.scss'],
})
export class DdPicturesInputComponent extends OnDestroyMixin {
  @Output() imagesChange: EventEmitter<string[][]> = new EventEmitter();

  images: string[] = [];

  private get _imageBuckets(): string[][] {
    return this._getImageBuckets();
  }

  constructor() {
    super();
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length === 0) return;

    const fileList = Array.from(files);
    const compressedFiles = fileList.map((file) =>
      imageCompression(file, {
        maxSizeMB: 1,
        useWebWorker: true,
      })
    );

    from(Promise.all(compressedFiles))
      .pipe(
        untilComponentDestroyed(this),
        mergeMap((files) =>
          combineLatest(files.map((file) => this._getBase64String$(file)))
        )
      )
      .subscribe({
        next: (images) => {
          this.images = [...this.images, ...images];
          this.imagesChange.emit(this._imageBuckets);
        },
        error: (error) => {
          console.error(`Blad - chuj ci w dupe maciek: ${error}`);
        },
      });
  }

  onDeleteImage(index: number): void {
    this.images.splice(index, 1);

    this.imagesChange.emit(this._imageBuckets);
  }

  private _getBase64String$(file: Blob): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();

      // @TODO: add proper type
      reader.onload = (event: any) => {
        observer.next(event.target?.result as string);
        observer.complete();
      };
      reader.onerror = (error) => observer.error(error);

      reader.readAsDataURL(file);
    });
  }

  private _getImageBuckets(): string[][] {
    const maxBucketSize = 4_194_304;
    const imagesWithLengths: [string, number][] = this.images.map((image) => [
      image,
      new TextEncoder().encode(image).length,
    ]);

    let bucket: string[] = [];
    let remainingBucketSize = maxBucketSize;
    const imageBuckets: string[][] = [];
    for (let i = 0; i < imagesWithLengths.length; i++) {
      const [image, length] = imagesWithLengths[i];

      if (length > remainingBucketSize) {
        imageBuckets.push(bucket);
        bucket = [image];
        remainingBucketSize = maxBucketSize - length;
      } else {
        bucket = [...bucket, image];
        remainingBucketSize -= length;
      }
    }
    imageBuckets.push(bucket);

    return imageBuckets;
  }
}
