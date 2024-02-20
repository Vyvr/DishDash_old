import { LoadableState, loadedState } from "../utils";

export interface FriendData {
    id: string;
    name: string;
    surname: string;
}

interface FriendRequestData {
    friend: FriendData;
    time: Date;
}

export interface SocialData {
    friends: FriendData[];
    friendRequests: FriendRequestData[];
}

export interface SocialState extends LoadableState<SocialData> {}

export const initialState: SocialState = {
    data: null,
    ...loadedState,
};