import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNil } from 'lodash-es';
import { InternalMenuBookPost } from 'src/app/store/menuBookPost';
import { EditedData } from '../../menu-book.model';

@Component({
  selector: 'app-post-edit-content',
  templateUrl: './post-edit-content.component.html',
  styleUrls: ['./post-edit-content.component.scss'],
})
export class PostEditContentComponent implements OnInit {
  @Input() post?: InternalMenuBookPost | null = null;

  @Output() toggleEdit = new EventEmitter<void>();
  @Output() editData = new EventEmitter<EditedData>();

  creationDate: Date | string | null = null;

  title: string = '';
  ingredients: string = '';
  preparation: string = '';

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

      this.title = this.post.title;
      this.ingredients = this.post.ingredients;
      this.preparation = this.post.preparation;

      return;
    }
  }

  toggleEditMode(): void {
    this.toggleEdit.emit();
  }

  editFromMenuBook(): void {
    if (isNil(this.post)) {
      return;
    }

    this.editData.emit({
      postId: this.post?.id,
      title: this.title,
      ingredients: this.ingredients,
      preparation: this.preparation,
    });
  }
}
