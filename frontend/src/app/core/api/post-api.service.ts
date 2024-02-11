import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostServiceClient } from 'src/app/pb/PostServiceClientPb';
import { CreatePostRequest, CreatePostResponse } from 'src/app/pb/post_pb';
import { handleRequest } from './utils';

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

  createPost({
    token,
    ownerId,
    ownerName,
    ownerSurname,
    title,
    ingredients,
    portionQuantity,
    preparation,
    picturesList,
  }: CreatePostRequest.AsObject): Observable<CreatePostResponse.AsObject> {
    const request = new CreatePostRequest();

    request.setToken(token);
    request.setOwnerId(ownerId);
    request.setOwnerName(ownerName);
    request.setOwnerSurname(ownerSurname);
    request.setTitle(title);
    request.setIngredients(ingredients);
    request.setPortionQuantity(portionQuantity);
    request.setPreparation(preparation);
    request.setPicturesList(picturesList);

    return handleRequest<
      CreatePostRequest,
      CreatePostResponse,
      CreatePostResponse.AsObject
    >(request, this.postServiceClient.create.bind(this.postServiceClient));
  }
}
