import { Component, Input, OnInit } from '@angular/core';
import { isEmpty, isNil } from 'lodash-es';
import { Post } from 'src/app/pb/post_pb';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input()
  post: Post.AsObject | null = null;

  creationDate: Date | string | null = null;
  urlImages: string[] = [];
  itemsLoadingSquareCount: number = 0;

  ngOnInit(): void {
    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
    ) {
      this.creationDate = new Date(
        this.post?.creationDate?.seconds * 1000
      ).toDateString();

      if (this.post.picturesList) {
        this.itemsLoadingSquareCount = this.post.picturesList.length;
      }

      this._loadPictures();

      return;
    }
  }

  private _loadPictures(): void {
    if (isNil(this.post) || isEmpty(this.post.picturesDataList)) {
      return;
    }
    const contentType = 'image/png'; // MIME type of the blob you're creating

    this.post.picturesDataList.forEach((picture) => {
      const base64String: string = picture.toString();
      const imageBlob = this._base64ToBlob(base64String, contentType);

      const imageUrl = URL.createObjectURL(imageBlob);
      this.itemsLoadingSquareCount -= 1;
      this.urlImages.push(imageUrl);
    });
  }

  private _base64ToBlob(base64: string, contentType: string): Blob {
    // Decode base64 string
    const binaryString = window.atob(base64);
    // Create a Uint8Array from binary string
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // Create and return a Blob from the Uint8Array
    return new Blob([bytes], { type: contentType });
  }
}
