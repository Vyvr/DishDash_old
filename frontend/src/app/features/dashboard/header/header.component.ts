import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from 'src/app/store/auth/auth.facade';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router, private authFacade: AuthFacade) {}

  navigateToPosts() {
    this.router.navigate(['/dashboard/posts']);
  }

  navigateToMenuBook() {
    this.router.navigate(['/dashboard/menu-book']);
  }

  navigateToFarmers() {
    this.router.navigate(['/dashboard/farmers']);
  }

  navigateToMarket() {
    this.router.navigate(['/dashboard/market']);
  }

  navigateToSettings() {
    this.router.navigate(['/dashboard/settings']);
  }

  logout() {
    this.authFacade.logout();
  }
}
