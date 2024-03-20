import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isNil } from 'lodash-es';
import { InternalMenuBookPost } from 'src/app/store/menuBookPost/menuBookPost.model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() post: InternalMenuBookPost | null = null;
  @Input() isSelected: boolean = false;

  @Output() postSelected = new EventEmitter<string>();

  selectPost(): void {
    if (isNil(this.post) || isNil(this.post.id)) {
      return;
    }

    this.postSelected.emit(this.post.id);
  }
}
