import { Component, OnInit } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';
import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';
import { AuthFacade } from 'src/app/store/auth';
import { MenuBookPostFacade } from 'src/app/store/menuBookPost';

@Component({
  selector: 'app-menu-book',
  templateUrl: './menu-book.component.html',
  styleUrls: ['./menu-book.component.scss'],
})
export class MenuBookComponent extends OnDestroyMixin implements OnInit {
  authState$ = this.authFacade.authState$;
  menuBookPostState$ = this.menuBookPostFacade.menuBookPostState$;

  selectedPostId: string | null = null;
  selectedPostData: MenuBookPost.AsObject | undefined = undefined;

  constructor(
    private authFacade: AuthFacade,
    private menuBookPostFacade: MenuBookPostFacade
  ) {
    super();
  }

  ngOnInit(): void {
    // this._loadPictures();
  }

  onPostSelected(postId: string): void {
    this.selectedPostId = postId;

    this.menuBookPostState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((postsState) => {
        if (isNil(postsState.data) || postsState.loading) {
          return;
        }

        this.selectedPostData = postsState.data.find(
          (post) => post.id === postId
        );
      });
  }
}
