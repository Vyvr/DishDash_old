import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEqual, isNil } from 'lodash-es';
import {
  DeleteCommentEvent,
  EditCommentEvent,
  NewCommentEvent,
  PartialDeleteCommentEvent,
  PartialEditCommentEvent,
  ToggleLikeEvent,
} from './post.model';
import { Post } from 'src/app/pb/post_pb';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post.AsObject | null = null;
  @Input() isCommentsOpen = false;
  @Input() isDeletePostModalOpen = false;
  @Input() isProfilePost = false;

  @Output() toggleLike = new EventEmitter<ToggleLikeEvent>();
  @Output() newComment = new EventEmitter<NewCommentEvent>();
  @Output() editComment = new EventEmitter<EditCommentEvent>();
  @Output() deleteComment = new EventEmitter<DeleteCommentEvent>();
  @Output() addToMenuBook = new EventEmitter<string>();
  @Output() postCommentsOpen = new EventEmitter<string>();
  @Output() postCommentsClose = new EventEmitter<void>();
  @Output() deletePost = new EventEmitter<string>();

  creationDate: Date | string | null = null;
  urlImages: string[] = [];
  itemsLoadingSquareCount: number = 0;
  deletePostTitle: string = '';

  constructor() {}

  ngOnInit(): void {
    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
    ) {
      this.creationDate = new Date(
        this.post?.creationDate?.seconds * 1000
      ).toDateString();

      return;
    }
  }

  onToggleLike(postId: string | undefined): void {
    if (isNil(postId) || isNil(this.post)) {
      return;
    }

    this.toggleLike.emit({ postId, liked: this.post.liked });
  }

  onAddToMenuBook(): void {
    if (isNil(this.post) || isNil(this.post.id) || this.post.isInMenuBook) {
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

  onEditComment({ commentId, commentText }: PartialEditCommentEvent): void {
    if (isNil(this.post)) {
      return;
    }

    this.editComment.emit({ postId: this.post.id, commentId, commentText });
  }

  onDeleteComment({ commentId }: PartialDeleteCommentEvent): void {
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

  onDeletePost(): void {
    if (isNil(this.post) || !isEqual(this.post.title, this.deletePostTitle)) {
      return;
    }

    this.deletePost.emit(this.post.id);
  }

  toggleDeletePostModal(): void {
    this.isDeletePostModalOpen = !this.isDeletePostModalOpen;
  }
}
