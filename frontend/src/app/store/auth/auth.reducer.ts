import { createReducer } from "@ngrx/store";
import { initialState } from "./auth.model";

export const authReducer = createReducer(initialState)