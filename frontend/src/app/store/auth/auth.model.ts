import { loadedState } from '../utils';

export interface AuthData {
  token: string | null;
  id: string | null;
  name: string | null;
  surname: string | null;
}

export interface AuthState {
  data: AuthData | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  data: null,
  ...loadedState,
};
