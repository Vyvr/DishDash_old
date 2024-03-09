import { Component, Input } from '@angular/core';
import { CommentsModalData } from './comments-modal.model';
import { PostFacade } from 'src/app/store/post';
import { Comment } from 'src/app/pb/post_pb';
import { isNil } from 'lodash-es';
import { CommentPostRequest, GetCommentsRequest } from 'src/app/pb/post_pb';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent {
  private _data: CommentsModalData = {
    token: '',
    postId: '',
    userId: '',
    isModalOpened: false,
  };

  @Input()
  get data(): CommentsModalData {
    return this._data;
  }

  set data(value: CommentsModalData | null) {
    if (isNil(value)) {
      return;
    }

    this._data = value;

    const payload: GetCommentsRequest.AsObject = {
      postId: this._data.postId,
      token: this._data.token,
      page: 0,
      pageSize: 10,
    };

    console.log(payload)

    this.postFacade.getComments(payload);
  }

  commentText: string = '';
  commentsList: Comment.AsObject[] | null = null;

  @Input()
  isModalOpened: boolean = false;

  constructor(private postFacade: PostFacade) {}

  //@TODO rozkminic czemu modal zamyka sie po
  //commentPost
  commentPost(event: Event): void {
    event.stopPropagation();
    if (isNil(this._data)) {
      return;
    }

    const payload: CommentPostRequest.AsObject = {
      token: this._data.token,
      id: this._data.postId,
      commentText: this.commentText,
    };

    this.postFacade.commentPost(payload);

    this.commentText = '';
    this.isModalOpened = true;
  }

  openModal(data: CommentsModalData): void {
    // // Create an observable that emits only the specific post
    // this.singlePost$ = this.postState$.pipe(
    //   map((state) => state.posts?.find((post) => post.id === this.postId))
    // );

    this._data = data;
    this.isModalOpened = data.isModalOpened;

    if (isNil(this._data)) {
      return;
    }

    const payload: GetCommentsRequest.AsObject = {
      postId: this._data.postId,
      token: this._data.token,
      page: 0,
      pageSize: 10,
    };

    this.postFacade.getComments(payload);
  }

  closeModal(): void {
    this.isModalOpened = false;
    if (isNil(this._data)) {
      return;
    }
    this.postFacade.clearComments({ postId: this._data.postId });
  }
}
