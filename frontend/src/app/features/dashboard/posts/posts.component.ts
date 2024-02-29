import { Component, OnInit, ViewChild } from '@angular/core';
import { CreatePostModalComponent } from '../create-post-modal/create-post-modal.component';
import { AuthFacade } from 'src/app/store/auth';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { combineLatest, filter, take } from 'rxjs';
import { PostFacade } from 'src/app/store/post/post.facade';
import { GetImageStreamRequest, GetPostsRequest } from 'src/app/pb/post_pb';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent extends OnDestroyMixin implements OnInit {
  @ViewChild(CreatePostModalComponent) modal: CreatePostModalComponent | null =
    null;

  postTitle: string = '';

  authState$ = this.authFacade.authState$;
  postState$ = this.postFacade.postState$;

  constructor(private authFacade: AuthFacade, private postFacade: PostFacade) {
    super();
  }

  ngOnInit(): void {
    this._loadPosts();
    this._loadPictures();
  }

  openCreatePostModal(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(this.modal) || authState.loading || isNil(authState.data)) {
          return;
        }

        const {
          data: { token, id },
        } = authState;
        const title = this.postTitle;

        this.modal.openModal({
          title,
          token,
          ownerId: id,
        });
      });
  }

  private _loadPosts(): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe(({ data }) => {
        if (isNil(data)) {
          return;
        }

        const payload: GetPostsRequest.AsObject = {
          page: 0,
          pageSize: 5,
          token: data.token,
        };

        this.postFacade.getPosts(payload);
      });
  }

  private _loadPictures(): void {
    combineLatest([this.authState$, this.postState$])
      .pipe(
        untilComponentDestroyed(this),
        filter(
          ([authState, postState]) => !authState?.loading && !postState?.loading
        ),
        take(1)
      )
      .subscribe(([{ data: authData }, { data: postData }]) => {
        if (isNil(postData) || isNil(authData)) {
          return;
        }

        postData.map((post) => {
          post.picturesList.map((path) => {
            const payload: GetImageStreamRequest.AsObject = {
              token: authData.token,
              picturePath: path,
            };

            this.postFacade.getImageStream(payload);
          });
        });
      });
  }
}
