import { CreatePostRequest, Post } from 'src/app/pb/post_pb';
import { LoadableState, loadedState } from '../utils';

export interface CreatePostPayload extends CreatePostRequest.AsObject {
  picturesBuckets: string[][];
}

export type InternalPost = Omit<
  Post.AsObject,
  'picturesList' | 'picturesDataList'
> & {
  pictures: { path: string; data?: string | Uint8Array }[];
};

export type PostsState = LoadableState<InternalPost[]>;

export const initialState: PostsState = {
  data: null,
  ...loadedState,
};
