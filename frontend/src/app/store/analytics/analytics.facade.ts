import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '..';

import * as actions from './analytics.actions';
import * as selectors from './analytics.selectors';
import { GetAllPostLikesAnaliticsDataRequest } from 'src/app/pb/post_pb';

@Injectable()
export class AnalyticsFacade {
  analyticsState$ = this.store.select(selectors.selectAnalyticsState);

  constructor(private store: Store<AppState>) {}

  GetAllPostLikesAnaliticsLikesData(payload: GetAllPostLikesAnaliticsDataRequest.AsObject): void {
    this.store.dispatch(actions.GetAllPostLikesAnaliticsLikesData(payload));
  }
}
