import { loadedState } from '../utils';

export interface UserData {
  token: string;
}

export interface AuthState {
  data: UserData | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  data: null,
  ...loadedState,
};
