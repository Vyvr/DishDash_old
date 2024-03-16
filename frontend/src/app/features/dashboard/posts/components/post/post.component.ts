import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEmpty, isNil } from 'lodash-es';
import { InternalPost } from 'src/app/store/post';
import { DeleteCommentEvent, EditCommentEvent, NewCommentEvent, PartialDeleteCommentEvent, PartialEditCommentEvent, ToggleLikeEvent } from './post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: InternalPost | null = null;
  @Input() isCommentsOpen = false;

  @Output() toggleLike = new EventEmitter<ToggleLikeEvent>();
  @Output() newComment = new EventEmitter<NewCommentEvent>();
  @Output() editComment = new EventEmitter<EditCommentEvent>();
  @Output() deleteComment = new EventEmitter<DeleteCommentEvent>();
  @Output() addToMenuBook = new EventEmitter<string>();
  @Output() postCommentsOpen = new EventEmitter<string>();
  @Output() postCommentsClose = new EventEmitter<void>();

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

      if (this.post.pictures) {
        this.itemsLoadingSquareCount = this.post.pictures.length;
      }

      this._loadPictures();

      return;
    }
  }

  constructor() {}

  onToggleLike(postId: string | undefined): void {
    if (isNil(postId) || isNil(this.post)) {
      return;
    }

    this.toggleLike.emit({ postId, liked: this.post.liked });
  }

  onAddToMenuBook(): void {
    if(isNil(this.post) || isNil(this.post.id)) {
      return;
    }

    this.addToMenuBook.emit(this.post.id);
  }

  onNewComment(commentText: string): void {
    if (isNil(this.post)) {
      return;
    }

    this.newComment.emit({ postId: this.post.id, commentText });
  }

  onEditComment({commentId, commentText}: PartialEditCommentEvent): void {
    if (isNil(this.post)) {
      return;
    }

    this.editComment.emit({ postId: this.post.id, commentId, commentText });
  }

  onDeleteComment({commentId}: PartialDeleteCommentEvent): void {
    if (isNil(this.post)) {
      return;
    }

    this.deleteComment.emit({ postId: this.post.id, commentId });
  }

  onOpenCommentsModal(): void {
    this.postCommentsOpen.emit(this.post?.id);
  }

  onCloseCommentsModal(): void {
    this.postCommentsClose.emit();
  }

  private _loadPictures(): void {
    if (isNil(this.post) || isEmpty(this.post.pictures)) {
      return;
    }
    const contentType = 'image/png'; // MIME type of the blob you're creating

    this.post.pictures.forEach((picture) => {
      if (isNil(picture.data)) {
        return;
      }
      const base64String: string = picture.data?.toString();
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
