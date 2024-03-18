import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from 'src/app/pb/post_pb';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isNil } from 'lodash-es';
import { PartialDeleteCommentEvent, PartialEditCommentEvent } from '../../post.model';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent {
  @Input() isOpen = false;
  @Input() commentsList?: Comment.AsObject[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() newComment = new EventEmitter<string>();
  @Output() editComment = new EventEmitter<PartialEditCommentEvent>();
  @Output() deleteComment = new EventEmitter<PartialDeleteCommentEvent>();

  commentContextMenuOpen: string | null = null;

  formGroup: FormGroup | null = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      commentText: new FormControl('', [Validators.minLength(1)]),
    });
  }

  onCloseModal(): void {
    this.close.emit();
  }

  onNewComment(event: MouseEvent): void {
    event.stopPropagation();

    if (isNil(this.formGroup)) {
      return;
    }

    this.newComment.emit(this.formGroup.get('commentText')?.value);
  }

  onEditComment({commentId, commentText}: PartialEditCommentEvent): void {
    this.editComment.emit({commentId, commentText});
  }

  onDeleteComment({commentId}: PartialDeleteCommentEvent): void {
    this.deleteComment.emit({commentId});
  }

  onContextMenuToggle(commentId: string|null): void {
    console.log(commentId)
    this.commentContextMenuOpen = commentId
    console.log(this.commentContextMenuOpen)
  }
}
