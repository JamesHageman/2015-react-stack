import alt from '../alt';

class MenuStore {
  constructor() {
    this.menuItems = [
      {
        title: 'Home',
        link: 'home'
      },
      {
        title: 'About',
        link: 'about'
      },
      {
        title: 'Twitter',
        link: 'http://twitter.com/JamesyHageman',
        route: false,
        target: '_blank'
      }
    ];
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
