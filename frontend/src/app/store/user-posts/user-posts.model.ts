import { CreatePostRequest, Post } from 'src/app/pb/post_pb';
import { LoadableState, loadedState } from '../utils';

export interface CreatePostPayload extends CreatePostRequest.AsObject {
  picturesBuckets: string[][];
}

export type UserPostsState = LoadableState<Post.AsObject[]> & {stopLoading: boolean};

export const initialState: UserPostsState = {
  data: null,
  stopLoading: false,
  ...loadedState,
};