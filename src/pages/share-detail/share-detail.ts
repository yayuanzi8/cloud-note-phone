import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Share } from '../../app/entities';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the ShareDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-detail',
  templateUrl: 'share-detail.html',
})
export class ShareDetailPage {

  private sid:string = null;

  private shareNote: Share = null;

  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public navParams: NavParams, @Inject('note') private noteService) {
    const sid = navParams.get('sid');
    if (sid) {
      this.sid = sid;
    }
  }

  private showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: '提示',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  private loadShareNote() {
    this.noteService.getShareDetails(this.sid).subscribe(note => {
      if (note) {
        this.shareNote = Object.assign({}, note);
      }else {
        this.showAlert('抓取数据失败');
      }
    });
  }

  ionViewDidLoad() {
    this.loadShareNote();
  }

  refreshShareNote(refresher) {
    this.loadShareNote();
    setTimeout(() =>{
      refresher.complete();
    },1000);
  }

}
