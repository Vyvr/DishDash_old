import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './features/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from './core/api/auth-api.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects, facades, reducers, metaReducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { HeaderComponent } from './features/dashboard/header/header.component';
import { PostsComponent } from './features/dashboard/posts/posts.component';
import { MenuBookComponent } from './features/dashboard/menu-book/menu-book.component';
import { MarketComponent } from './features/dashboard/market/market.component';
import { FarmersComponent } from './features/dashboard/farmers/farmers.component';
import { SettingsComponent } from './features/dashboard/settings/settings.component';

const devImports = [
  StoreDevtoolsModule.instrument({
    maxAge: 50,
  }),
];

@NgModule({
  declarations: [AppComponent, AuthComponent, DashboardComponent, HeaderComponent, PostsComponent, MenuBookComponent, MarketComponent, FarmersComponent, SettingsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
      metaReducers,
    }),
    StoreRouterConnectingModule.forRoot(),
    devImports,
  ],
  providers: [AuthApiService, ...facades],
  bootstrap: [AppComponent],
})
export class AppModule {}
