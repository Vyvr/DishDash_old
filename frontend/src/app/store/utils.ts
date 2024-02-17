export interface LoadableState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const loadingState = {
  loading: true,
  error: null,
};

export const loadedState = {
  loading: false,
  error: null,
};

export const errorState = (
  error: string
): Omit<LoadableState<any>, 'data'> => ({
  error,
  loading: false,
});
