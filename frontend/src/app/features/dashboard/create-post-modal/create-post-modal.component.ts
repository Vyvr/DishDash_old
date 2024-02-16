import { Component, Input } from '@angular/core';
import { ModalData } from './create-post-modal.model';
import { CreatePostRequest } from 'src/app/pb/post_pb';
import { PostFacade } from 'src/app/store/post/post.facade';

@Component({
  selector: 'create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss'],
})
export class CreatePostModalComponent {
  private data: ModalData | null = null;

  isVisible: boolean = false;

  postTitle: string = '';
  postIngredients: string = '';
  portionQuantity: number = 1;
  postPreparation: string = '';
  postImages: string[] = [];

  constructor(private postFacade: PostFacade) {}

  openModal(data: ModalData) {
    this.data = data;
    this.postTitle = data.title;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  onImagesChange(images: string[]) {
    this.postImages = images;
  }

  submitPost() {
    if (!this.data) {
      return;
    }
    const payload: CreatePostRequest.AsObject = {
      token: this.data.token,
      ownerId: this.data.ownerId,
      ownerName: this.data.ownerName,
      ownerSurname: this.data.ownerSurname,
      title: this.postTitle,
      ingredients: this.postIngredients,
      portionQuantity: this.portionQuantity,
      preparation: this.postPreparation,
      picturesList: this.postImages,
    };

    this.postFacade.createPost(payload);
  }
}
