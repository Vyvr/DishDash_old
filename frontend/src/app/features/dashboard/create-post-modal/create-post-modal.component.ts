import { Component, Input } from '@angular/core';

@Component({
  selector: 'create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss'],
})
export class CreatePostModalComponent {
  isVisible: boolean = false;

  postTitle: string = '';
  postIngredients: string = '';
  portionQuantity: number = 1;
  postPreparation: string = '';

  openModal(title: string) {
    this.postTitle = title;
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  submitPost() {
    console.log(
      'title' +
        this.postTitle +
        'ingredients' +
        this.postIngredients +
        'quantity' +
        this.portionQuantity +
        'preparation' +
        this.postPreparation
    );
  }
}
