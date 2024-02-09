import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CanActivateDashboard } from './core/can-activate-dashboard.guard';
import { PostsComponent } from './features/dashboard/posts/posts.component';
import { FarmersComponent } from './features/dashboard/farmers/farmers.component';
import { MenuBookComponent } from './features/dashboard/menu-book/menu-book.component';
import { MarketComponent } from './features/dashboard/market/market.component';
import { SettingsComponent } from './features/dashboard/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [CanActivateDashboard],
    children: [
      { path: 'posts', component: PostsComponent },
      { path: 'menu-book', component: MenuBookComponent },
      { path: 'market', component: MarketComponent },
      { path: 'farmers', component: FarmersComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: '**', redirectTo: '/auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
