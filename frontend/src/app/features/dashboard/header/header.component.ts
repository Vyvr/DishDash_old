import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';
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
import { Plugins } from './header.enums';
import { IconButtons } from './header.model';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends OnDestroyMixin {
  private authState$ = this.authFacade.authState$;
  private searchState$ = this.searchFacade.searchState$;
  private socialState$ = this.socialFacade.socialState$;

  plugins = Plugins;
  iconButtons = IconButtons;

  queryString: string = '';
  searchedUsers: UserBasicInfo.AsObject[] = [];
  friendsList: UserBasicInfo.AsObject[] = [];
  selectedPlugin: string = 'posts';

  currentPage = 1;
  pageSize = 2;
  noMoreUsersToSearch = false;

  isInputFocused = false;

  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private searchFacade: SearchFacade,
    private socialFacade: SocialFacade // private socketService: SocketApiService
  ) {
    super();
  }

  ngOnInit(): void {
    const savedPlugin = sessionStorage.getItem('selectedPlugin');
    this.selectedPlugin = savedPlugin ? savedPlugin : 'posts';

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
          pageSize: this.pageSize,
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

  navigateToSomething(plugin: string): void {
    this.router.navigate([plugin]);
    this.selectedPlugin = plugin;
    sessionStorage.setItem('selectedPlugin', plugin);
  }

  logout(): void {
    sessionStorage.removeItem('selectedPlugin');
    this.authFacade.logout();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isInputOrChild = target.closest('search-bar-wrapper');
    const isSearchUsersList = target.closest('.searched-users-list');

    if (!isInputOrChild && !isSearchUsersList && this.queryString.length !== 0) {
      this.queryString = '';
      this.searchForUsers();
    }
  }

  onFocus(): void {
    this.isInputFocused = true;
  }

  onBlur(): void {
    this.isInputFocused = false;
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
          pageSize: this.pageSize,
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

        this.searchedUsers = users;
        this.noMoreUsersToSearch = noMoreUsersToLoad;
      });
  }
}
