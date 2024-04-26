import { Component, HostListener } from '@angular/core';
import { AuthFacade } from 'src/app/store/auth';
import { UserPostsFacade } from 'src/app/store/user-posts';
import {
  DeleteCommentEvent,
  EditCommentEvent,
  EditPostEvent,
  NewCommentEvent,
} from '../posts/components/post/post.model';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { combineLatest, filter, from, mergeMap, take } from 'rxjs';
import { isNil } from 'lodash-es';
import {
  CommentPostRequest,
  EditCommentRequest,
  DeleteCommentRequest,
  GetCommentsRequest,
  DeletePostRequest,
  EditPostRequest,
  GetAllPostLikesAnaliticsDataRequest,
  GetPostsRequest,
} from 'src/app/pb/post_pb';
import { bindTokenToPayload } from 'src/app/core/api/utils';
import { getBase64String$ } from 'src/app/features/utils';
import imageCompression from 'browser-image-compression';
import { AddUserPictureRequest } from 'src/app/pb/auth_pb';
import { ChartBuilder } from './analytics/analytics.model';
import { AnalyticsFacade } from 'src/app/store/analytics';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent extends OnDestroyMixin {
  defaultProfilePicturePath: string =
    '../../../../assets/default-user-picture.webp';

  profilePicture: string | null = null;

  authState$ = this.authFacade.authState$;
  userPostsState$ = this.userPostsFacade.userPostsState$;
  analyticsState$ = this.analyticsFacade.analyticsState$;

  isSettingsModalVisible = false;
  isAnalyticsModalVisible = false;

  commentsOpenPostId: string | null = null;

  chartBuilder: ChartBuilder;

  private _postsPage: number = 1;

  constructor(
    private authFacade: AuthFacade,
    private userPostsFacade: UserPostsFacade,
    private analyticsFacade: AnalyticsFacade
  ) {
    super();
    this.chartBuilder = new ChartBuilder();
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

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length === 0) return;

    const fileList = Array.from(files);
    const compressedFiles = fileList.map((file) =>
      imageCompression(file, {
        maxSizeMB: 1,
        useWebWorker: true,
      })
    );

    from(Promise.all(compressedFiles))
      .pipe(
        untilComponentDestroyed(this),
        mergeMap((files) =>
          combineLatest(files.map((file: Blob) => getBase64String$(file)))
        )
      )
      .subscribe({
        next: (images) => {
          this.profilePicture = images[0];
        },
        error: (error) => {
          console.error(`error dd-pictues-input: ${error}`);
        },
      });
  }

  onDeletePost(postId: string): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = bindTokenToPayload<DeletePostRequest.AsObject>(
          { postId },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.deleteUserPost(payload);
      });
  }

  onEditPost({
    id,
    title,
    ingredients,
    preparation,
    portionQuantity,
  }: EditPostEvent): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = bindTokenToPayload<EditPostRequest.AsObject>(
          { postId: id, title, ingredients, preparation, portionQuantity },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.editUserPost(payload);
      });
  }

  toggleSettingsModal(): void {
    this.isSettingsModalVisible = !this.isSettingsModalVisible;
  }
  toggleAnalyticsModal(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload: GetAllPostLikesAnaliticsDataRequest.AsObject = {
          token: authState.data.token,
        };

        this.analyticsFacade.GetAllPostLikesAnaliticsLikesData(payload);
      });

    this.isAnalyticsModalVisible = !this.isAnalyticsModalVisible;
  }

  addUserPicture(): void {
    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        if (isNil(this.profilePicture) || isNil(authState.data)) {
          return;
        }
        const payload = bindTokenToPayload<AddUserPictureRequest.AsObject>(
          { userId: authState.data?.id, image: this.profilePicture },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.authFacade.addUserPicture(payload);
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight) {
      this._loadPosts();
      this._postsPage++;
    }
  }

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
            page: this._postsPage,
            pageSize: 10,
          },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.userPostsFacade.getPosts(payload);
      });
  }
}
