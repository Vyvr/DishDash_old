import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { SocialState } from "./social.model";

const selectBase = (state: AppState): SocialState => state.social;

export const selectSocialState = createSelector(selectBase, (state) => state)