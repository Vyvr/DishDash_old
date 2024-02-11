import { loadedState } from '../utils';

export interface PostData {
  id: string | null;
  ownerId: string | null;
  ownerName: string | null;
  ownerSurname: string | null;
  title: string | null;
  ingredients: string | null;
  portion_quantity: number | null;
  preparation: string | null;
  pictures: string[] | null;
}

export interface PostsState {
  data: PostData[] | null;
  error: string | null;
  loading: boolean;
}

export const initialState: PostsState = {
  data: null,
  ...loadedState,
};
