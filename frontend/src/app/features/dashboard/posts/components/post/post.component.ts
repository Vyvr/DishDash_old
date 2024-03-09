import { Component, Input, OnInit } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isEmpty, isNil } from 'lodash-es';
import { filter, take } from 'rxjs';
import { ToggleLikeRequest } from 'src/app/pb/post_pb';
import { AuthFacade } from 'src/app/store/auth';
import { PostFacade } from 'src/app/store/post/post.facade';
import { InternalPost } from 'src/app/store/post';
import { CommentsModalData } from './components/comments-modal/comments-modal.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent extends OnDestroyMixin implements OnInit {
  // @ViewChild(CommentsModalComponent) modal: CommentsModalComponent | null =
  //   null;
  commentsModalData: CommentsModalData | null = null;

  @Input()
  post: InternalPost | null = null;

  creationDate: Date | string | null = null;
  urlImages: string[] = [];
  itemsLoadingSquareCount: number = 0;

  authState$ = this.authFacade.authState$;
  postState$ = this.postFacade.postState$;

  ngOnInit(): void {
    if (
      !isNil(this.post?.creationDate?.seconds) &&
      this.post?.creationDate?.seconds !== undefined
    ) {
      this.creationDate = new Date(
        this.post?.creationDate?.seconds * 1000
      ).toDateString();

      if (this.post.pictures) {
        this.itemsLoadingSquareCount = this.post.pictures.length;
      }

      this._loadPictures();

      return;
    }
  }

  constructor(private authFacade: AuthFacade, private postFacade: PostFacade) {
    super();
  }

  toggleLike(postId: string | undefined): void {
    if (isNil(postId) || isNil(this.post)) {
      return;
    }

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

        if (!isNil(this.post)) {
          const payload: ToggleLikeRequest.AsObject = {
            token: data.token,
            id: this.post.id,
          };

          if (this.post.liked) {
            this.postFacade.unlikePost(payload);
          } else {
            this.postFacade.likePost(payload);
          }
        }
      });
  }

  openCommentsModal(): void {
    // this.authState$
    //   .pipe(untilComponentDestroyed(this), take(1))
    //   .subscribe((authState) => {
    //     if (isNil(this.post) || authState.loading || isNil(authState.data)) {
    //       return;
    //     }

    //     const {
    //       data: { id, token },
    //     } = authState;

    //     const getCommentsPayload: GetCommentsRequest.AsObject = {
    //       postId: this.post.id,
    //       token,
    //       page: 0,
    //       pageSize: 10,
    //     };

    //     this.postFacade.getComments(getCommentsPayload);

    //     this.commentsModalData = {
    //       token: token,
    //       userId: id,
    //       postId: this.post.id,
    //       commentsList: this.post.commentsList,
    //       isModalOpened: true,
    //     };
    //   });
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(this.post) || authState.loading || isNil(authState.data)) {
          return;
        }

        const {
          data: { id, token },
        } = authState;

        this.commentsModalData = {
          token: token,
          userId: id,
          postId: this.post.id,
          isModalOpened: true,
        };
      });
  }

  private _loadPictures(): void {
    if (isNil(this.post) || isEmpty(this.post.pictures)) {
      return;
    }
    const contentType = 'image/png'; // MIME type of the blob you're creating

    this.post.pictures.forEach((picture) => {
      if (isNil(picture.data)) {
        return;
      }
      const base64String: string = picture.data?.toString();
      const imageBlob = this._base64ToBlob(base64String, contentType);

      const imageUrl = URL.createObjectURL(imageBlob);
      this.itemsLoadingSquareCount -= 1;
      this.urlImages.push(imageUrl);
    });
  }

  private _base64ToBlob(base64: string, contentType: string): Blob {
    // Decode base64 string
    const binaryString = window.atob(base64);
    // Create a Uint8Array from binary string
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // Create and return a Blob from the Uint8Array
    return new Blob([bytes], { type: contentType });
  }
}
