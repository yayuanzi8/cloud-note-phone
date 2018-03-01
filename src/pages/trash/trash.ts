import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';


/**
 * Generated class for the TrashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trash',
  templateUrl: 'trash.html',
})
export class TrashPage {

  rubbishes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl:AlertController, @Inject('note') private noteService) {
  }

  private showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: '提示',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  private loadTrashList() {
    this.noteService.getMyTrashList().subscribe(rubbishes => {
      if (rubbishes) {
        this.rubbishes = rubbishes;
      }
    });
  }

  ionViewDidLoad() {
    this.loadTrashList();
  }

  refreshTrashList(refresher) {
    this.loadTrashList();
    setTimeout(() => {
      refresher.complete();
    },1000);
  }

  recover(rubbish) {
    this.noteService.recover(rubbish.rid).subscribe(changeNum => {
      if (changeNum >= 1) {
        let index = -1;
        this.rubbishes.forEach((loopRubbish, loopIndex) => {
          if (loopRubbish.rid === rubbish.rid) {
            index = loopIndex;
          }
        });
        this.rubbishes = [...this.rubbishes.slice(0, index), ...this.rubbishes.slice(index + 1)];
        this.showAlert('恢复成功！');
      }else {
        this.showAlert('恢复失败！');
      }
    });
  }

}
