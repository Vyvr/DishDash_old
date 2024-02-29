import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { PostServiceClient } from 'src/app/pb/PostServiceClientPb';
import {
  AddPostImagesRequest,
  AddPostImagesResponse,
  CreatePostRequest,
  CreatePostResponse,
  GetImageStreamRequest,
  GetImageStreamResponse,
  GetPostsRequest,
  GetPostsResponse,
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

  getImageStream(
    payload: GetImageStreamRequest.AsObject
  ): Observable<GetImageStreamResponse.AsObject> {
    const request = new GetImageStreamRequest();

    bindPayloadToRequest(request, payload);

    return new Observable(
      (observer: Subscriber<GetImageStreamResponse.AsObject>) => {
        const call = this.postServiceClient.getImageStream(request, {});

        call.on('data', (response) => {
          const imageDataBase64 = response.getImageData_asB64();

          observer.next({
            imageData: imageDataBase64,
            postId: response.getPostId(),
          });
        });

        call.on('error', (err) => {
          console.error('Stream error:', err);
          observer.error(err);
        });

        call.on('end', () => {
          observer.complete();
        });
      }
    );
  }

  // currently not used because i'm using blob instead, but better leave it here
  private _arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
