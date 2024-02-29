import { Component, Input, OnInit } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';
import { Post } from 'src/app/pb/post_pb';
import { PostFacade } from 'src/app/store/post/post.facade';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent extends OnDestroyMixin implements OnInit {
  @Input()
  post: Post.AsObject | null = null;
  creationDate: Date | string | null = null;

  image: any;

  postState$ = this.postFacade.postState$;

  constructor(private postFacade: PostFacade) {
    super();
  }

  ngOnInit(): void {
    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
    ) {
      this.creationDate = new Date(
        this.post?.creationDate?.seconds * 1000
      ).toDateString();

      // this.postState$
      //   .pipe(untilComponentDestroyed(this), take(1))
      //   .subscribe(({ data }) => {
      //     if (isNil(data)) {
      //       return;
      //     }

      //       this.image =  data[0].picturesDataList[0];
      //     });

      return;
    }
  }
}
