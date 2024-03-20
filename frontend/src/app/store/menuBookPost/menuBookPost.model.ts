import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';
import { LoadableState, loadedState } from '../utils';

export type InternalMenuBookPost = Omit<
  MenuBookPost.AsObject,
  'picturesList' | 'picturesDataList'
> & {
  pictures: { path: string; data?: string | Uint8Array }[];
};

export type MenuBookPostsState = LoadableState<InternalMenuBookPost[]>;

export const initialState: MenuBookPostsState = {
  data: null,
  ...loadedState,
};
