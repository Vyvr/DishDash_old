import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEqual, isNil } from 'lodash-es';
import {
  DeleteCommentEvent,
  EditCommentEvent,
  EditPostEvent,
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
  @Input() isEditPostModalOpen = false;
  @Input() isProfilePost = false;

  @Output() toggleLike = new EventEmitter<ToggleLikeEvent>();
  @Output() newComment = new EventEmitter<NewCommentEvent>();
  @Output() editComment = new EventEmitter<EditCommentEvent>();
  @Output() deleteComment = new EventEmitter<DeleteCommentEvent>();
  @Output() addToMenuBook = new EventEmitter<string>();
  @Output() postCommentsOpen = new EventEmitter<string>();
  @Output() postCommentsClose = new EventEmitter<void>();
  @Output() deletePost = new EventEmitter<string>();
  @Output() editPost = new EventEmitter<EditPostEvent>();

  creationDate: Date | string | null = null;
  urlImages: string[] = [];
  itemsLoadingSquareCount: number = 0;
  deletePostTitle: string = '';

  editPostTitle: string = '';
  editPostIngredients: string = '';
  editPostPreparation: string = '';
  editPostPortionQuantity: string = '';

  constructor() {}

  ngOnInit(): void {
    if (isNil(this.post)) {
      return;
    }

    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
    ) {
      this.creationDate = new Date(
        this.post?.creationDate?.seconds * 1000
      ).toDateString();
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

  onEditSubmit(): void {
    if (
      isNil(this.post) ||
      this.editPostTitle === '' ||
      this.editPostIngredients === '' ||
      this.editPostPreparation === '' ||
      this.editPostPortionQuantity === ''
    ) {
      return;
    }

    this.editPost.emit({
      id: this.post.id,
      title: this.editPostTitle,
      ingredients: this.editPostIngredients,
      preparation: this.editPostPreparation,
      portionQuantity: parseInt(this.editPostPortionQuantity, 10),
    });

    this.isEditPostModalOpen = !this.isEditPostModalOpen;
  }

  toggleDeletePostModal(): void {
    this.isDeletePostModalOpen = !this.isDeletePostModalOpen;
  }

  toggleEditPostModal(): void {
    if (isNil(this.post)) {
      return;
    }

    this.editPostTitle = this.post.title;
    this.editPostIngredients = this.post.ingredients;
    this.editPostPreparation = this.post.preparation;
    this.editPostPortionQuantity = this.post.portionQuantity.toString();

    this.isEditPostModalOpen = !this.isEditPostModalOpen;
  }
}
