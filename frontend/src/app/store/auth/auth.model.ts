import { LoadableState, loadedState } from '../utils';

export interface AuthData {
  token: string;
  id: string;
  name: string;
  surname: string;
  picturePath?: string;
  pictureData?: string;
}

export interface AuthState extends LoadableState<AuthData> {
  refreshSuccessful: boolean | null;
}

export const initialState: AuthState = {
  refreshSuccessful: null,
  data: null,
  ...loadedState,
};
