import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './features/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from './core/api/auth-api.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects, facades, reducers, metaReducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgApexchartsModule } from 'ng-apexcharts';

import { HeaderComponent } from './features/dashboard/header/header.component';
import { PostListComponent } from './features/dashboard/posts/post-list.component';
import { MenuBookComponent } from './features/dashboard/menu-book/menu-book.component';
import { MarketComponent } from './features/dashboard/market/market.component';
import { FarmersComponent } from './features/dashboard/farmers/farmers.component';
import { SettingsComponent } from './features/dashboard/settings/settings.component';
import { CreatePostModalComponent } from './features/dashboard/create-post-modal/create-post-modal.component';
import { DdInputComponent } from './shared/components/dd-input/dd-input.component';
import { DdPicturesInputComponent } from './shared/components/dd-pictures-input/dd-pictures-input.component';
import { SearchApiService } from './core/api/search-api.service';
import { PostApiService } from './core/api/post-api.service';
import { SocialApiService } from './core/api/social-api.service';
import { WebSocketService } from './core/api/socket-api.service';
import { PostComponent } from './features/dashboard/posts/components/post/post.component';
import { DdPicturesGridComponent } from './shared/components/dd-pictures-grid/dd-pictures-grid.component';
import { DdModalComponent } from './shared/components/dd-modal/dd-modal.component';
import { CommentsModalComponent } from './features/dashboard/posts/components/post/components/comments-modal/comments-modal.component';
import { CommentTileComponent } from './features/dashboard/posts/components/post/components/comments-modal/components/comment-tile/comment-tile.component';
import { PostCardComponent } from './features/dashboard/menu-book/components/post-card/post-card.component';
import { PostContentComponent } from './features/dashboard/menu-book/components/post-content/post-content.component';
import { PostEditContentComponent } from './features/dashboard/menu-book/components/post-edit-content/post-edit-content.component';
import { UserProfileComponent } from './features/dashboard/user-profile/user-profile.component';
import { DdRequestingSpinnerComponent } from './shared/components/dd-requesting-spinner/dd-requesting-spinner.component';
import { RoutePipe } from './features/dashboard/header/route.pipe';
import { DdButtonComponent } from './shared/components/dd-button/dd-button.component';
import { DdModalFooterComponent } from './shared/components/dd-modal-footer/dd-modal-footer.component';
import { ChatComponent } from './features/dashboard/chat/chat.component';

const devImports = [
  StoreDevtoolsModule.instrument({
    maxAge: 50,
  }),
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    HeaderComponent,
    PostListComponent,
    MenuBookComponent,
    MarketComponent,
    FarmersComponent,
    SettingsComponent,
    CreatePostModalComponent,
    DdInputComponent,
    DdPicturesInputComponent,
    PostComponent,
    DdPicturesGridComponent,
    DdModalComponent,
    CommentsModalComponent,
    CommentTileComponent,
    PostCardComponent,
    PostContentComponent,
    PostEditContentComponent,
    UserProfileComponent,
    DdRequestingSpinnerComponent,
    RoutePipe,
    DdButtonComponent,
    DdModalFooterComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
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
  providers: [
    AuthApiService,
    SearchApiService,
    PostApiService,
    SocialApiService,
    WebSocketService,
    ...facades,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
