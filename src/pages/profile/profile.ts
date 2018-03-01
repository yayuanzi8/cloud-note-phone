import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject('auth') private authService) {
  }

  private loadUserInfo() {
    this.authService.loginUserInfo().subscribe(user => {
      if (user) {
        this.user = Object.assign({}, user);
      }
    });
  }

  ionViewDidLoad() {
    this.loadUserInfo();
  }

  refreshUserInfo(refresher) {
    this.loadUserInfo();
    setTimeout(() => {
      refresher.complete();
    },1000);
  }

  logout() {
    this.authService.unAuth().subscribe(auth => {
      if (!auth.pass) {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  toUserDetails() {
    this.navCtrl.push('ProfileDetailPage', {
      user: this.user
    });
  }

}
