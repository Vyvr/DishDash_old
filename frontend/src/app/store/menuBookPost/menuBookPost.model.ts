import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';
import { LoadableState, loadedState } from '../utils';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

// export interface CreatePostPayload extends CreatePostRequest.AsObject {
//   picturesBuckets: string[][];
// }

export type InternalMenuBookPost = Omit<
  MenuBookPost.AsObject,
  'picturesList' | 'picturesDataList'
> & {
  pictures: { path: string; data?: string | Uint8Array }[];
};

// export type MenuBookPostsState = LoadableState<InternalMenuBookPost[]>;

export interface MenuBookData {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerSurname: string;
  title: string;
  ingredients: string;
  portionQuantity: number;
  preparation: string;
  picturesList: string[];
  picturesDataList: (string | Uint8Array)[];
  creationDate?: Timestamp.AsObject | undefined;
}

export type MenuBookPostsState = LoadableState<MenuBookData[]>;

export const initialState: MenuBookPostsState = {
  data: null,
  ...loadedState,
};
