import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Loading, Alert } from 'ionic-angular';

@Injectable()
export class NoticeService {

    private loadingRef: Loading;
    private alertRef: Alert

    constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

    public showLoading(content) {
        this.loadingRef = this.loadingCtrl.create({
            content: content
        });
        this.loadingRef.present();

        setTimeout(() => {
            this.loadingRef.dismiss();
        }, 10000);
    }

    public hideLoading() {
        this.loadingRef.dismissAll();
    }

    public showHint(message) {
        this.alertRef = this.alertCtrl.create({
            subTitle: '提示',
            message: message,
            buttons: ['OK']
        });
        this.alertRef.present();
    }


}