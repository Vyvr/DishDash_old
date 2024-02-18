import { Injectable } from "@angular/core";
import { AppState } from "..";
import { Store } from "@ngrx/store";
import { GetByQueryRequest } from "src/app/pb/user_pb";

import * as actions from './search.actions';
import * as selectors from './search.selectors';

@Injectable()
export class SearchFacade {
    searchState$ = this.store.select(selectors.selectSearchState);

    constructor(private store: Store<AppState>) {}

    searchByQuery(payload: GetByQueryRequest.AsObject): void {
        this.store.dispatch(actions.searchByQuery(payload));
    }
}