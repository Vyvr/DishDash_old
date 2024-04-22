export interface ToggleLikeEvent {
  postId: string;
  liked: boolean;
}

export interface NewCommentEvent {
  postId: string;
  commentText: string;
}

export interface EditCommentEvent {
  postId: string;
  commentId: string;
  commentText: string;
}

export interface DeleteCommentEvent {
  postId: string;
  commentId: string;
}

export interface EditPostEvent {
  id: string;
  title: string; 
  ingredients: string;
  preparation: string;
  portionQuantity: number;
}

export type PartialEditCommentEvent = Omit<EditCommentEvent, 'postId'>;
export type PartialDeleteCommentEvent = Omit<DeleteCommentEvent, 'postId'>;
