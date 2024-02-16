import { LoadableState, loadedState } from '../utils';

export interface AuthData {
  token: string;
  id: string;
  name: string;
  surname: string;
}

export interface AuthState  extends LoadableState<AuthData> {}

export const initialState: AuthState = {
  data: null,
  ...loadedState,
};
