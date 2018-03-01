import { Component, Inject } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Auth } from '../../app/entities';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username = '';
  password = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    @Inject('auth') private authService) {
      
  }

  ionViewDidLoad() {
    
  }

  private showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: '提示',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  private checkUsernameAndPassword(): string {
    const trimUsername = this.username.trim();
    const trimPassword = this.password.trim();
    if (trimUsername === '') {
      return '用户名不能为空';
    }
    if (trimPassword === '') {
      return '密码不能为空';
    }
    return null;
  }


  login() {
    const errorMsg = this.checkUsernameAndPassword();
    if (errorMsg != null) {
      this.showAlert(errorMsg);
      return;
    }
    this.authService.login(this.username.trim(), this.password.trim()).subscribe((auth: Auth) => {
      if (auth.pass){
        this.navCtrl.push(TabsPage);
      }else {
        this.showAlert(auth.errorMsg);
      }
    });
  }

}
