import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@IonicPage()
@Component({
  selector: 'page-myshare',
  templateUrl: 'myshare.html',
})
export class MysharePage {

  shareList = [];

  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public navParams: NavParams, @Inject('note') private noteService) {
  }

  private showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: '提示',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  loadShareList() {
    this.noteService.getMyShare().subscribe(shareList => {
      this.shareList = shareList;
    });
  }

  ionViewDidLoad() {
    this.loadShareList();
  }

  goToShareDetail(share) {
    this.navCtrl.push('ShareDetailPage', {sid: share.sid});
  }

  cancelShare(share) {
    this.noteService.cancelShare(share.sid).subscribe(changeNum => {
      if (changeNum > 0) {
        const index = this.shareList.indexOf(share);
        if (index != -1) {
          this.shareList = [...this.shareList.slice(0,index), ...this.shareList.slice(index + 1)];
          this.showAlert('已取消分享');
        }
      }else if (changeNum === -1){
        this.showAlert('取消失败');
      }
    });
  }

  refreshShareList(refresher) {
    this.loadShareList();
    setTimeout(() => {
      refresher.complete();
    },1000);
  }

}
