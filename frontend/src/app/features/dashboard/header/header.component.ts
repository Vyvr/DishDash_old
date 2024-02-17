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
