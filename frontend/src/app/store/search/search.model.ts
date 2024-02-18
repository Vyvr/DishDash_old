import { LoadableState, loadedState } from "../utils";

interface FoundUser {
    id: string;
    name: string;
    surname: string;
}

export interface SearchData {
    users: FoundUser[];
}

export interface SearchState extends LoadableState<SearchData> {}

export const initialState: SearchState = {
    data: null,
    ...loadedState,
};