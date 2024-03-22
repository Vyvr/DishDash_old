import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DeleteFromMenuBookRequest,
  DeleteFromMenuBookResponse,
  EditMenuBookPostRequest,
  EditMenuBookPostResponse,
  GetPostsFromMenuBookRequest,
  GetPostsFromMenuBookResponse,
} from 'src/app/pb/menu_book_post_pb';
import { MenuBookPostServiceClient } from 'src/app/pb/Menu_book_postServiceClientPb';
import { bindPayloadToRequest, handleRequest } from './utils';

@Injectable({
  providedIn: 'root',
})
export class MenuBookPostApiService {
  private MenuBookPostServiceClient: MenuBookPostServiceClient;

  constructor() {
    this.MenuBookPostServiceClient = new MenuBookPostServiceClient(
      'http://localhost:8082',
      null,
      null
    );
  }

  getPostsFromMenuBook(
    payload: GetPostsFromMenuBookRequest.AsObject
  ): Observable<GetPostsFromMenuBookResponse.AsObject> {
    const request = new GetPostsFromMenuBookRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      GetPostsFromMenuBookRequest,
      GetPostsFromMenuBookResponse,
      GetPostsFromMenuBookResponse.AsObject
    >(
      request,
      this.MenuBookPostServiceClient.getPostsFromMenuBook.bind(
        this.MenuBookPostServiceClient
      )
    );
  }

  deleteFromMenuBook(
    payload: DeleteFromMenuBookRequest.AsObject
  ): Observable<DeleteFromMenuBookResponse.AsObject> {
    const request = new DeleteFromMenuBookRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      DeleteFromMenuBookRequest,
      DeleteFromMenuBookResponse,
      DeleteFromMenuBookResponse.AsObject
    >(
      request,
      this.MenuBookPostServiceClient.deleteFromMenuBook.bind(
        this.MenuBookPostServiceClient
      )
    );
  }

  editMenuBookPost(
    payload: EditMenuBookPostRequest.AsObject
  ): Observable<EditMenuBookPostResponse.AsObject> {
    const request = new EditMenuBookPostRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      EditMenuBookPostRequest,
      EditMenuBookPostResponse,
      EditMenuBookPostResponse.AsObject
    >(
      request,
      this.MenuBookPostServiceClient.editMenuBookPost.bind(
        this.MenuBookPostServiceClient
      )
    );
  }

  //   addImages(
  //     payload: AddPostImagesRequest.AsObject
  //   ): Observable<AddPostImagesResponse.AsObject> {
  //     const request = new AddPostImagesRequest();

  //     bindPayloadToRequest(request, payload);

  //     return handleRequest<
  //       AddPostImagesRequest,
  //       AddPostImagesResponse,
  //       AddPostImagesResponse.AsObject
  //     >(request, this.postServiceClient.addImages.bind(this.postServiceClient));
  //   }

  //   getImageStream(
  //     payload: GetImageStreamRequest.AsObject
  //   ): Observable<GetImageStreamResponse.AsObject> {
  //     const request = new GetImageStreamRequest();

  //     bindPayloadToRequest(request, payload);

  //     return new Observable(
  //       (observer: Subscriber<GetImageStreamResponse.AsObject>) => {
  //         const call = this.postServiceClient.getImageStream(request, {});

  //         call.on('data', (response) => {
  //           const imageDataBase64 = response.getImageData_asB64();
  //           const picturePath = response.getPicturePath();

  //           observer.next({
  //             imageData: imageDataBase64,
  //             picturePath,
  //             postId: response.getPostId(),
  //           });
  //         });

  //         call.on('error', (err) => {
  //           console.error('Stream error:', err);
  //           observer.error(err);
  //         });

  //         call.on('end', () => {
  //           observer.complete();
  //         });
  //       }
  //     );
  //   }
}
