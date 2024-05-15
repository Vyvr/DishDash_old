import { Plugins } from './header.enums';

export const IconButtons = [
  {
    svg: 'assets/user-profile-icon.svg',
    plugin: Plugins.USER_PROFILE,
    alt: 'User Profile',
  },
  {
    svg: 'assets/posts-icon.svg',
    plugin: Plugins.POSTS,
    alt: 'Posts',
  },
  {
    svg: 'assets/menu-book-icon.svg',
    plugin: Plugins.MENU_BOOK,
    alt: 'Menu book',
  },
  // {
  //     svg: 'assets/shop-icon.svg',
  //     plugin: Plugins.MARKET,
  //     alt: 'Market',
  //   },
  //     {
  //         svg: 'assets/farm-tractor-icon.svg',
  //         plugin: Plugins.FARMERS,
  //         alt: 'Farmers',
  //     },
  {
    svg: 'assets/user-settings-icon.svg',
    plugin: Plugins.SETTINGS,
    alt: 'Settings',
  },
];
