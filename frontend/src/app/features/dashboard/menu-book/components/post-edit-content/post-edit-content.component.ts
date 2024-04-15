import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNil } from 'lodash-es';
import { EditedData } from '../../menu-book.model';
import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';

@Component({
  selector: 'app-post-edit-content',
  templateUrl: './post-edit-content.component.html',
  styleUrls: ['./post-edit-content.component.scss'],
})
export class PostEditContentComponent implements OnInit {
  @Input() post?: MenuBookPost.AsObject | null = null;

  @Output() toggleEdit = new EventEmitter<void>();
  @Output() editData = new EventEmitter<EditedData>();

  creationDate: Date | string | null = null;

  title: string = '';
  ingredients: string = '';
  preparation: string = '';
  portionQuantity: string = '';

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
      this.portionQuantity = this.post.portionQuantity.toString();

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
      portionQuantity: Number(this.portionQuantity),
    });
  }
}
