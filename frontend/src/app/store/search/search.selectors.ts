import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { SearchState } from "./search.model";

const selectBase = (state: AppState): SearchState => state.search;

export const selectSearchState = createSelector(selectBase, (state) => state)