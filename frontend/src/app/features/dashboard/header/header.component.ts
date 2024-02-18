import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';
import { GetByQueryRequest, UserBasicInfo } from 'src/app/pb/user_pb';
import { AuthFacade } from 'src/app/store/auth/auth.facade';
import { SearchFacade } from 'src/app/store/search';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends OnDestroyMixin {
  private authState$ = this.authFacade.authState$;
  private searchState$ = this.searchFacade.searchState$;

  queryString: string = '';
  searchedUsers: UserBasicInfo.AsObject[] = [];

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private searchFacade: SearchFacade
  ) {
    super();
  }

  searchForUsers(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(authState.data) || authState.loading) {
          return;
        }

        const {
          data: { token, id },
        } = authState;

        const payload: GetByQueryRequest.AsObject = {
          userId: id,
          token,
          queryString: this.queryString,
        };

        this.searchFacade.searchByQuery(payload);
      });

    this.searchState$
      .pipe(untilComponentDestroyed(this))
      .subscribe((searchState) => {
        if (isNil(searchState.data) || searchState.loading) {
          return;
        }

        const {
          data: { users },
        } = searchState;

        this.searchedUsers = users;
      });
  }

  navigateToPosts(): void {
    this.router.navigate(['/dashboard/posts']);
  }

  navigateToMenuBook(): void {
    this.router.navigate(['/dashboard/menu-book']);
  }

  navigateToFarmers(): void {
    this.router.navigate(['/dashboard/farmers']);
  }

  navigateToMarket(): void {
    this.router.navigate(['/dashboard/market']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/dashboard/settings']);
  }

  logout(): void {
    this.authFacade.logout();
  }
}
