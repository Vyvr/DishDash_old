import { Component, Input, OnInit } from '@angular/core';
import { isNil } from 'lodash-es';
import { Post } from 'src/app/pb/post_pb';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input()
  post: Post.AsObject | null = null;
  creationDate: Date | string | null = null;

  ngOnInit(): void {
    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
      ) {
        console.log(this.post?.creationDate?.seconds)
        this.creationDate = new Date(this.post?.creationDate?.seconds * 1000).toDateString();
      return;
    }
  }
}
