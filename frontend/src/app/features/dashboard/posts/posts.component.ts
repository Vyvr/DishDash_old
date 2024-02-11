import { Component, ViewChild } from '@angular/core';
import { CreatePostModalComponent } from '../create-post-modal/create-post-modal.component';
import { AuthFacade, AuthState } from 'src/app/store/auth';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent extends OnDestroyMixin {
  @ViewChild(CreatePostModalComponent) modal: CreatePostModalComponent | null =
    null;

  postTitle: string = '';

  authState$ = this.authFacade.authState$;

  constructor(private authFacade: AuthFacade) {
    super();
  }

  openCreatePostModal() {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(this.modal) || authState.loading || isNil(authState.data)) {
          return;
        }

        const {
          data: { token, name, surname, id },
        } = authState;
        const title = this.postTitle;

        this.modal.openModal({
          title,
          token,
          ownerId: id,
          ownerName: name,
          ownerSurname: surname,
        });
      });
  }
}
