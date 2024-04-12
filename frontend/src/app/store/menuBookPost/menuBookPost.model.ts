import { LoadableState, loadedState } from '../utils';
import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';

export type MenuBookPostsState = LoadableState<MenuBookPost.AsObject[]>;

export const initialState: MenuBookPostsState = {
  data: null,
  ...loadedState,
};
export { MenuBookPost };

