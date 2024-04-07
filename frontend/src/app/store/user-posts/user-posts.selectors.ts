import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { UserPostsState } from "./user-posts.model";

const selectBase = (state: AppState): UserPostsState => state.userPosts;

export const selectUserPostsState = createSelector(selectBase, (state) => state);