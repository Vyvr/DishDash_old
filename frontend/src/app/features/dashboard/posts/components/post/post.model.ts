export interface  ToggleLikeEvent {
  postId: string;
  liked: boolean;
};

export interface NewCommentEvent {
  postId: string;
  commentText: string;
}