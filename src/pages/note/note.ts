///<reference path="../../app/tinymce.d.ts"/> 
import { Component, Inject, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController, AlertController } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Note } from '../../app/entities';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

/**
 * Generated class for the NotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
})
export class NotePage implements OnDestroy {

  private nid = '';
  private editor;

  note: Note = null;
  item: FormControl;

  constructor(private formBuilder: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, @Inject('note') private noteService) {
    const nid = navParams.get('nid');
    if (nid) {
      this.nid = nid;
    }
    this.item = this.formBuilder.control('');
    this.loadNote(this.nid);
  }

  private loadNote(nid) {
    this.noteService.loadNote(nid).subscribe(note => {
      if (note) {
        this.note = Object.assign({}, note);
        this.item.setValue(this.note.content);
      }
    });
  }

  private showAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: '提示',
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  openFuncPopover($event) {
    const popoverRef = this.popoverCtrl.create(FunctionsPage);
    popoverRef.present({
      ev: $event
    });
  }

  saveNote() {
    const content = this.item.value;
    this.noteService.savaNote(this.note.nid, this.note.title, content).subscribe(note => {
      if (note) {
        this.note = Object.assign({},note);
        this.item.setValue(this.note.content);
        this.showAlert('保存成功');
      }else {
        this.showAlert('保存失败')
      }
    });
  }

  ionViewDidLoad() {
    
  }

  ngOnDestroy() {
    
  }

}

@Component({
  template: `
  <ion-list no-lines style="text-align: center;">
    <button ion-item (click)="ocrRecognize()">字符识别</button>
    <button ion-item (click)="speechRecognize()">语音识别</button>
    <button ion-item (click)="insertImage()">插入图片</button>
  </ion-list>
  `
})
export class FunctionsPage {
  constructor(public alertCtrl:AlertController, public viewCtrl: ViewController,
    @Inject('image') private imageService, @Inject('notice') private noticeService) {}

  ocrRecognize() {
    this.imageService.ocr().then(recognizeResult => {
      if (recognizeResult.code === 20000) {
        this.noticeService.showHint(JSON.stringify(recognizeResult));
      }else {
        this.noticeService.showHint(JSON.stringify(recognizeResult));
      }
    }).catch(err => {
      this.noticeService.showHint(JSON.stringify(err));
    });
  }

  speechRecognize() {
    this.imageService.speech().then(recognizeResult => {
      if (recognizeResult.code === 20000) {
        this.noticeService.showHint(JSON.stringify(recognizeResult));
      }else {
        this.noticeService.showHint(JSON.stringify(recognizeResult));
      }
    }).catch(err => {
      this.noticeService.showHint(JSON.stringify(err));
    });
  }

  insertImage() {

  }
}
