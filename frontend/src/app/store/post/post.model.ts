import { LoadableState, loadedState } from '../utils';

export interface PostData {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerSurname: string;
  title: string;
  ingredients: string;
  portionQuantity: number;
  preparation: string;
  pictures: string[];
}

export interface PostsState extends LoadableState<PostData[]> {}

export const initialState: PostsState = {
  data: null,
  ...loadedState,
};
