import { CreatePostRequest } from "src/app/pb/post_pb";

export type ModalData = { title: string } & Pick<
  CreatePostRequest.AsObject,
  'ownerId' | 'token' | 'ownerName' | 'ownerSurname'
>;