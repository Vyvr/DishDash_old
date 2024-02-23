import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostServiceClient } from 'src/app/pb/PostServiceClientPb';
import {
  AddPostImagesRequest,
  AddPostImagesResponse,
  CreatePostRequest,
  CreatePostResponse,
  GetPostsRequest, 
  GetPostsResponse
} from 'src/app/pb/post_pb';
import { bindPayloadToRequest, handleRequest } from './utils';

@Injectable({
  providedIn: 'root',
})
export class PostApiService {
  private postServiceClient: PostServiceClient;

  constructor() {
    this.postServiceClient = new PostServiceClient(
      'http://localhost:8082',
      null,
      null
    );
  }

  createPost(
    payload: CreatePostRequest.AsObject
  ): Observable<CreatePostResponse.AsObject> {
    const request = new CreatePostRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      CreatePostRequest,
      CreatePostResponse,
      CreatePostResponse.AsObject
    >(request, this.postServiceClient.create.bind(this.postServiceClient));
  }

  addImages(
    payload: AddPostImagesRequest.AsObject
  ): Observable<AddPostImagesResponse.AsObject> {
    const request = new AddPostImagesRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      AddPostImagesRequest,
      AddPostImagesResponse,
      AddPostImagesResponse.AsObject
    >(request, this.postServiceClient.addImages.bind(this.postServiceClient));
  }

  getFriendsPosts(
    payload: GetPostsRequest.AsObject
  ): Observable<GetPostsResponse.AsObject> {
    const request = new GetPostsRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      GetPostsRequest,
      GetPostsResponse,
      GetPostsResponse.AsObject
    >(request, this.postServiceClient.getPosts.bind(this.postServiceClient));
  }
}
