import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNil } from 'lodash-es';
import { InternalMenuBookPost } from 'src/app/store/menuBookPost/menuBookPost.model';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss'],
})
export class PostContentComponent implements OnInit {
  @Input() post?: InternalMenuBookPost | null = null;
  @Input() images?: string[] | null = [];

  creationDate: Date | string | null = null;

  @Output() toggleEdit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

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

  toggleEditMode(): void {
    this.toggleEdit.emit();
  }

  deleteFromMenuBook(): void {
    if (isNil(this.post) || isNil(this.post.id)) {
      return;
    }

    this.delete.emit(this.post.originalPostId);
  }
}
