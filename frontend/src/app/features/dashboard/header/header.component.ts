import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';
// import { SocketApiService } from 'src/app/core/api/socket-api.service';
import {
  AddToFriendsRequest,
  DeleteFromFriendsRequest,
  GetByQueryRequest,
  GetFriendsRequest,
  UserBasicInfo,
} from 'src/app/pb/user_pb';
import { AuthFacade } from 'src/app/store/auth/auth.facade';
import { SearchFacade } from 'src/app/store/search';
import { SocialFacade } from 'src/app/store/social';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends OnDestroyMixin {
  private authState$ = this.authFacade.authState$;
  private searchState$ = this.searchFacade.searchState$;
  private socialState$ = this.socialFacade.socialState$;

  queryString: string = '';
  searchedUsers: UserBasicInfo.AsObject[] = [];
  friendsList: UserBasicInfo.AsObject[] = [];

  currentPage = 1;
  pageSize = 2;
  noMoreUsersToSearch = false;

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private searchFacade: SearchFacade,
    private socialFacade: SocialFacade
  ) // private socketService: SocketApiService
  {
    super();
  }

  ngOnInit(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(authState.data) || authState.loading) {
          return;
        }

        const {
          data: { token, id },
        } = authState;

        const payload: GetFriendsRequest.AsObject = {
          token,
          id,
        };

        this.socialFacade.getFriends(payload);
      });

    this.socialState$
      .pipe(untilComponentDestroyed(this))
      .subscribe((socialState) => {
        if (isNil(socialState.data) || socialState.loading) {
          return;
        }

        this.friendsList = socialState.data.friends;
      });
  }

  searchForUsers(): void {
    this.currentPage = 1;
    this.noMoreUsersToSearch = false;
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
          page: this.currentPage,
          pagesize: this.pageSize,
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
          data: { users, noMoreUsersToLoad },
        } = searchState;

        this.searchedUsers = users;
        this.noMoreUsersToSearch = noMoreUsersToLoad;
      });
  }

  searchMoreUsers(): void {
    if (!this.noMoreUsersToSearch) {
      this.currentPage++;
      this.searchForUsersAndAppend();
    }
  }

  isFriend(id: string): boolean {
    return this.friendsList.some((friend) => friend.id === id);
  }

  addToFriends(userId: string): void {
    // this.socketService.sendFriendRequest('hej');
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(authState.data) || authState.loading) {
          return;
        }

        const {
          data: { token, id },
        } = authState;

        const payload: AddToFriendsRequest.AsObject = {
          token,
          userA: id,
          userB: userId,
        };

        this.socialFacade.addToFriends(payload);
      });
  }

  deleteFriend(userId: string): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(authState.data) || authState.loading) {
          return;
        }

        const {
          data: { token, id },
        } = authState;

        const payload: DeleteFromFriendsRequest.AsObject = {
          token,
          id,
          friendId: userId,
        };

        this.socialFacade.deleteFromFriends(payload);
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

  private searchForUsersAndAppend(): void {
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
          page: this.currentPage,
          pagesize: this.pageSize,
        };

        this.searchFacade.searchByQueryAndAppend(payload);
      });

    this.searchState$
      .pipe(untilComponentDestroyed(this))
      .subscribe((searchState) => {
        if (isNil(searchState.data) || searchState.loading) {
          return;
        }

        const {
          data: { users, noMoreUsersToLoad },
        } = searchState;

        this.searchedUsers = users
        this.noMoreUsersToSearch = noMoreUsersToLoad;
      });
  }
}
