import { LoadableState, loadedState } from '../utils';

export interface AuthData {
  token: string;
  id: string;
  name: string;
  surname: string;
  email: string;
  description: string;
  picturePath?: string;
}

export interface AuthState extends LoadableState<AuthData> {
  refreshSuccessful: boolean | null;
}

export const initialState: AuthState = {
  refreshSuccessful: null,
  data: null,
  ...loadedState,
};
