import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { isNil } from 'lodash-es';
import { Comment } from 'src/app/pb/post_pb';
import {
  PartialDeleteCommentEvent,
  PartialEditCommentEvent,
} from '../../../../post.model';

@Component({
  selector: 'app-comment-tile',
  templateUrl: './comment-tile.component.html',
  styleUrls: ['./comment-tile.component.scss'],
})
export class CommentTileComponent implements OnInit, OnChanges {
  @Input()
  data: Comment.AsObject | null = null;

  @Output() editComment = new EventEmitter<PartialEditCommentEvent>();
  @Output() deleteComment = new EventEmitter<PartialDeleteCommentEvent>();

  @ViewChild('contextMenu') contextMenu!: ElementRef;
  @ViewChild('optionsButton') optionsButton!: ElementRef<HTMLButtonElement>;

  isContextMenuOpen = false;
  commentText: string = '';

  isEditMode: boolean = false;

  get creationDate(): Date | string | null {
    if (
      isNil(this.data) ||
      isNil(this.data.creationDate) ||
      (isNil(this.data?.creationDate?.seconds) &&
        this.data?.creationDate?.seconds !== undefined)
    ) {
      return null;
    }

    return new Date(this.data?.creationDate?.seconds * 1000).toLocaleString();
  }

  constructor(private _eref: ElementRef) {}

  ngOnInit(): void {
    if (isNil(this.data)) {
      return;
    }
    this.commentText = this.data?.commentText;
  }

  ngOnChanges(): void {
    if (isNil(this.data)) {
      return;
    }
    this.commentText = this.data?.commentText;
  }

  toggleContextMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isContextMenuOpen = !this.isContextMenuOpen;

    if (this.isContextMenuOpen) {
      setTimeout(() => {
        const buttonRect =
          this.optionsButton.nativeElement.getBoundingClientRect();
        const menuElement = this.contextMenu.nativeElement;

        menuElement.style.top = `${buttonRect.bottom + window.scrollY}px`;
        menuElement.style.left = `${buttonRect.left + window.scrollX}px`;
      }, 0);
    }
  }

  @HostListener('document:click', ['$event'])
  closeContextMenu(event: MouseEvent): void {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isContextMenuOpen = false;
    }
  }

  onEditComment(): void {
    this.isEditMode = false;
    this.isContextMenuOpen = !this.isContextMenuOpen;
    if (isNil(this.data) || isNil(this.commentText)) {
      return;
    }

    this.editComment.emit({
      commentId: this.data.id,
      commentText: this.commentText,
    });
  }

  onDeleteComment(): void {
    this.isContextMenuOpen = !this.isContextMenuOpen;
    if (isNil(this.data)) {
      return;
    }
    console.log(this.data);
    this.deleteComment.emit({ commentId: this.data.id });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.isContextMenuOpen = !this.isContextMenuOpen;
  }

  cancelEditComment(): void {
    this.isEditMode = false;
    if (isNil(this.data)) {
      return;
    }
    this.commentText = this.data?.commentText;
  }
}
