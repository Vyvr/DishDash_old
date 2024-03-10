import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from 'src/app/pb/post_pb';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isNil } from 'lodash-es';

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
}
