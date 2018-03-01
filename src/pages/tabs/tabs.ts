import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabRoot1 = {
    root: 'FileListPage',
    tabIcon: 'folder'
  };

  tabRoot2 = {
    root: 'MysharePage',
    tabIcon: 'share'
  }

  tabRoot3 = {
    root: 'TrashPage',
    tabIcon: 'trash'
  }

  tabRoot4 = {
    root: 'ProfilePage',
    tabIcon: 'person'
  }

  constructor() {
  }
}
