import { CreatePostRequest, Post } from 'src/app/pb/post_pb';
import { LoadableState, loadedState } from '../utils';

export interface CreatePostPayload extends CreatePostRequest.AsObject {
  picturesBuckets: string[][];
}

export type PostsState = LoadableState<Post.AsObject[]>;

export const initialState: PostsState = {
  data: null,
  ...loadedState,
};
