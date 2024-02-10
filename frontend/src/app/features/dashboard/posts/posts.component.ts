import { Component, ViewChild } from '@angular/core';
import { CreatePostModalComponent } from '../create-post-modal/create-post-modal.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  @ViewChild(CreatePostModalComponent) modal!: CreatePostModalComponent;
  postTitle: string = '';

  openCreatePostModal() {
    this.modal.openModal(this.postTitle);
  }
}
