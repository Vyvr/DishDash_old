import { Component, Input, OnInit } from '@angular/core';
import { isNil } from 'lodash-es';
import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss'],
})
export class PostContentComponent implements OnInit {
  @Input() post: MenuBookPost.AsObject | undefined = undefined;

  creationDate: Date | string | null = null;

  ngOnInit(): void {
    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
    ) {
      this.creationDate = new Date(
        this.post?.creationDate?.seconds * 1000
      ).toDateString();

      // if (this.post.pictures) {
      //   this.itemsLoadingSquareCount = this.post.pictures.length;
      // }

      // this._loadPictures();

      return;
    }
  }
}
