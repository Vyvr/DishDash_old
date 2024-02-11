import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { PostsState } from "./post.model";

const selectBase = (state: AppState): PostsState => state.posts;

export const selectPostsState = createSelector(selectBase, (state) => state);