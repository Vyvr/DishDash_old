import { Analytics } from 'src/app/pb/post_pb';
import { LoadableState, loadedState } from '../utils';

export type AnalyticsState = LoadableState<Analytics.AsObject>;

export const initialState: AnalyticsState = {
  data: null,
  ...loadedState,
};
export { Analytics };
