import { Component, ViewChild } from '@angular/core';
import { CreatePostModalComponent } from '../create-post-modal/create-post-modal.component';
import { AuthFacade } from 'src/app/store/auth';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { filter, take } from 'rxjs';
import { PostFacade } from 'src/app/store/post/post.facade';
import {
  AddToMenuBookRequest,
  CommentPostRequest,
  DeleteCommentRequest,
  EditCommentRequest,
  GetCommentsRequest,
  GetPostsRequest,
  ToggleLikeRequest,
} from 'src/app/pb/post_pb';
import { bindTokenToPayload } from 'src/app/core/api/utils';
import {
  DeleteCommentEvent,
  EditCommentEvent,
  NewCommentEvent,
  ToggleLikeEvent,
} from './components/post/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent extends OnDestroyMixin {
  @ViewChild(CreatePostModalComponent) modal: CreatePostModalComponent | null =
    null;

  authState$ = this.authFacade.authState$;
  postState$ = this.postFacade.postState$;

  postTitle: string = '';
  commentsOpenPostId: string | null = null;

  constructor(private authFacade: AuthFacade, private postFacade: PostFacade) {
    super();
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

        this.postFacade.getComments(payload);
      });
  }

  onPostCommentsClose(): void {
    this.commentsOpenPostId = null;
  }

  onToggleLike({ liked, postId }: ToggleLikeEvent): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<ToggleLikeRequest.AsObject>(
          { id: postId },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        if (liked) {
          this.postFacade.unlikePost(payload);
          return;
        }

        this.postFacade.likePost(payload);
      });
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

        this.postFacade.commentPost(payload);
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

        this.postFacade.editComment(payload);
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

        this.postFacade.deleteComment(payload);
      });
  }

  onAddToMenuBook(postId: string): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<AddToMenuBookRequest.AsObject>(
          { postId },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.postFacade.addToMenuBook(payload);
      });
  }

  // implemented in guard but i'll leave it here for now
  private _loadPosts(): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<GetPostsRequest.AsObject>(
          {
            page: 0,
            pageSize: 10,
          },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.postFacade.getPosts(payload);
      });
  }

  // private _loadPictures(): void {
  //   combineLatest([this.authState$, this.postState$])
  //     .pipe(
  //       untilComponentDestroyed(this),
  //       filter(
  //         ([authState, postState]) => !authState?.loading && !postState?.loading
  //       ),
  //       take(1)
  //     )
  //     .subscribe(([{ data: authData }, { data: postData }]) => {
  //       if (isNil(postData) || isNil(authData)) {
  //         return;
  //       }

  //       postData.forEach((post) => {
  //         post.pictures.forEach(({ path, data }) => {
  //           if (!isNil(data)) {
  //             return;
  //           }

  //           const payload: GetImageStreamRequest.AsObject = {
  //             token: authData.token,
  //             picturePath: path,
  //           };

  //           this.postFacade.getImageStream(payload);
  //         });
  //       });
  //     });
  // }
}
