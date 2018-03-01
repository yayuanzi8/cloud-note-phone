import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,
  ViewController, ActionSheetController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-profile-detail',
  templateUrl: 'profile-detail.html',
})
export class ProfileDetailPage {

  user = null;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController,
    public navParams: NavParams, @Inject('auth') private authService, @Inject('image') private imageService,
    @Inject('notice') private noticeService, public actionSheetCtrl: ActionSheetController) {
    const user = navParams.get('user');
    if (user) {
      this.user = Object.assign({}, user);
    }
  }

  ionViewDidLoad() {}

  logout() {
    this.authService.unAuth().subscribe(auth => {
      if (!auth.pass) {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  toChangeEmailModal() {
    const modalRef = this.modalCtrl.create(ChangeEmailModal, {
      email: this.user.email
    }, {
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    modalRef.onDidDismiss((data) => {
      if (data && data.change) {
        this.user.email = data.email;
      }
    });
    modalRef.present();
  }

  toChangePswModal() {
    const modalRef = this.modalCtrl.create(ChangePswModal, {}, {
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    modalRef.present();
  }

  selectPortrait() {
    const actionSheet = this.actionSheetCtrl.create({
      title: '更换头像',
      buttons: [
        {
          text: '拍照',
          icon: 'camera',
          handler: () => {
            this.imageService.selectPortraitByCamera().then(imageResult => {
              if (imageResult.code === 20000) {
                this.user.portrait = imageResult.url;
                this.noticeService.showHint('修改成功');
              }else {
                this.noticeService.showHint(imageResult.msg);
              }
            });
          }
        },
        {
          text: '从相册选择',
          icon: 'image',
          handler: () => {
            this.imageService.selectPortraitByImagePicker().then(imageResult => {
              if (imageResult.code === 20000) {
                this.user.portrait = imageResult.url;
                this.noticeService.showHint('修改成功');
              }else {
                this.noticeService.showHint(imageResult.msg);
              }
            });
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

}

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>
        修改密码
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="cancel()">
          <span ion-text showWhen="ios">取消</span>
          <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item style="margin-top: 10px;">
      <ion-label inset>
        旧密码
      </ion-label>
      <ion-input type="password" [(ngModel)]="oldPsw"></ion-input>
    </ion-item>
    <ion-item style="margin-top: 10px;">
      <ion-label inset>
        新密码
      </ion-label>
      <ion-input type="password" [(ngModel)]="newPsw"></ion-input>
    </ion-item>
    <div style="text-align: center; margin-left: 20px; margin-right: 20px;margin-top: 10px;">
        <button ion-button [disabled]="oldPsw==''||newPsw==''" (tap)="confirm()" block color="primary">
            确认修改
        </button>
    </div>
  </ion-content>
  `
})
export class ChangePswModal {
  oldPsw = '';
  newPsw = '';

  constructor(public navParams: NavParams, public viewCtrl: ViewController,
    @Inject('auth') private authService, @Inject('notice') private noticeService) { }

  cancel() {
    this.viewCtrl.dismiss();
  }

  confirm() {
    if (this.oldPsw === this.newPsw) {
      this.noticeService.showHint('密码未更换！');
      return;
    }
    this.authService.changePsw(this.oldPsw, this.newPsw).subscribe(result => {
      if (result.code === 20000) {
        this.noticeService.showHint(result.msg);
        this.viewCtrl.dismiss();
      }else {
        this.noticeService.showHint(result.msg);
      }
    });
  }
  

}


@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>
        修改邮箱
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="cancel()">
          <span ion-text showWhen="ios">取消</span>
          <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item style="margin-top: 10px;">
      <ion-label inset>
        邮箱
      </ion-label>
      <ion-input type="email" [(ngModel)]="email"></ion-input>
    </ion-item>
    <ion-item>
        <ion-label inset>
         验证码
        </ion-label>
        <ion-input type="text" [(ngModel)]="emailCode"></ion-input>
    </ion-item>
    <div style="text-align: center; margin-left: 20px; margin-right: 20px;margin-top: 30px;">
        <button ion-button [disabled]="email==''||emailSending" (tap)="sendEmailCode()" block color="danger">
            {{emailSending?'30秒后重新获取':'获取验证码'}}
        </button>
    </div>
    <div style="text-align: center; margin-left: 20px; margin-right: 20px;margin-top: 10px;">
        <button ion-button [disabled]="email==''||emailCode==''" (tap)="confirm()" block color="primary">
            确认修改
        </button>
    </div>
  </ion-content>`
})
export class ChangeEmailModal {

  oldEmail = '';
  email = '';
  emailCode = '';

  emailSending = false;

  constructor(public navParams: NavParams, public viewCtrl: ViewController,
    @Inject('auth') private authService, @Inject('notice') private noticeService) {
    const oldEmail = navParams.get('email');
    if (oldEmail) {
      this.oldEmail = oldEmail;
    }
  }

  cancel() {
    this.viewCtrl.dismiss({change: false, email: null});
  }

  confirm() {
    if (this.email === this.oldEmail) {
      this.noticeService.showHint('邮箱未更换！');
      return;
    }
    this.authService.changeEmail(this.email, this.emailCode).subscribe(result => {
      if (result.code === 20000) {
        this.noticeService.showHint(result.msg);
        this.viewCtrl.dismiss({change: true, email: this.email});
      }else {
        this.noticeService.showHint(result.msg);
      }
    });
  }

  sendEmailCode() {
    if (this.email === this.oldEmail) {
      this.noticeService.showHint('邮箱未更换！');
      return;
    }
    this.authService.sendEmail(this.email).subscribe(msg => {
      this.noticeService.showHint(msg);
      this.emailSending = true;
      setTimeout(() => {
        this.emailSending = false;
      } ,30000);
    });
  }
}

