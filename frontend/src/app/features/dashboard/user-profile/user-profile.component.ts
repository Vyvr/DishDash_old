import { Component, OnInit } from '@angular/core';
import { AuthFacade } from 'src/app/store/auth';
import { UserPostsFacade } from 'src/app/store/user-posts';
import {
  DeleteCommentEvent,
  EditCommentEvent,
  NewCommentEvent,
} from '../posts/components/post/post.model';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { combineLatest, filter, take } from 'rxjs';
import { isNil } from 'lodash-es';
import {
  CommentPostRequest,
  EditCommentRequest,
  DeleteCommentRequest,
  GetImageStreamRequest,
  GetCommentsRequest,
} from 'src/app/pb/post_pb';
import { bindTokenToPayload } from 'src/app/core/api/utils';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent extends OnDestroyMixin implements OnInit {
  defaultProfilePicturePath: string =
    '../../../../assets/default-user-picture.webp';

  authState$ = this.authFacade.authState$;
  userPostsState$ = this.userPostsFacade.userPostsState$;

  commentsOpenPostId: string | null = null;

  constructor(
    private authFacade: AuthFacade,
    private userPostsFacade: UserPostsFacade
  ) {
    super();
  }

  ngOnInit(): void {
    this._loadPictures();
  }

  onNewComment({ postId, commentText }: NewCommentEvent): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<CommentPostRequest.AsObject>(
          { id: postId, commentText },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.commentPost(payload);
      });
  }

  onEditComment({ postId, commentId, commentText }: EditCommentEvent): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<EditCommentRequest.AsObject>(
          { postId, commentId, commentText },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.editComment(payload);
      });
  }

  onDeleteComment({ postId, commentId }: DeleteCommentEvent): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<DeleteCommentRequest.AsObject>(
          { postId, commentId },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.deleteComment(payload);
      });
  }

  onPostCommentsOpen(postId: string): void {
    this.commentsOpenPostId = postId;

    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = bindTokenToPayload<GetCommentsRequest.AsObject>(
          { page: 0, pageSize: 10, postId },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.getComments(payload);
      });
  }

  onPostCommentsClose(): void {
    this.commentsOpenPostId = null;
  }

  private _loadPictures(): void {
    combineLatest([this.authState$, this.userPostsState$])
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

        postData.forEach((post) => {
          post.pictures.forEach(({ path, data }) => {
            if (!isNil(data)) {
              return;
            }

            const payload: GetImageStreamRequest.AsObject = {
              token: authData.token,
              picturePath: path,
            };

            this.userPostsFacade.getImageStream(payload);
          });
        });
      });
  }
}
