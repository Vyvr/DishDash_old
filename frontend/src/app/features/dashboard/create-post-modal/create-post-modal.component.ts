import { Component } from '@angular/core';
import { ModalData } from './create-post-modal.model';
import { PostFacade } from 'src/app/store/post/post.facade';
import { CreatePostPayload } from 'src/app/store/post/post.model';

@Component({
  selector: 'create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss'],
})
export class CreatePostModalComponent {
  private data: ModalData | null = null;

  isVisible: boolean = false;
  invalidCreatePostData: boolean = false;

  postTitle: string = '';
  postIngredients: string = '';
  portionQuantity: number = 1;
  postPreparation: string = '';
  postImagesBuckets: string[][] = [];

  constructor(private postFacade: PostFacade) {}

  openModal(data: ModalData): void {
    this.data = data;
    this.postTitle = data.title;
    this.isVisible = true;
  }

  closeModal(): void {
    this.invalidCreatePostData = false;
    this.isVisible = false;
  }

  onImagesChange(images: string[][]): void {
    this.postImagesBuckets = images;
  }

  submitPost(): void {
    if (
      (!this.data && this.postTitle.length < 3) ||
      this.postIngredients.length < 3 ||
      this.postPreparation.length < 3 ||
      !this.portionQuantity
    ) {
      this.invalidCreatePostData = true;
      return;
    }

    const payload: CreatePostPayload = {
      token: this.data.token,
      ownerId: this.data.ownerId,
      title: this.postTitle,
      ingredients: this.postIngredients,
      portionQuantity: this.portionQuantity,
      preparation: this.postPreparation,
      picturesList: [],
      picturesBuckets: this.postImagesBuckets,
    };

    this.postFacade.createPost(payload);
    this.closeModal();

    this.postTitle = '';
    this.postIngredients = '';
    this.portionQuantity = 1;
    this.postPreparation = '';
    this.postImagesBuckets = [];
  }
}
