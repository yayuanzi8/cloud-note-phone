import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ViewController  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-file-list',
  templateUrl: 'file-list.html',
})
export class FileListPage {

  DIR_STR = 'directory';
  NOTE_STR = 'note';

  fileList = [];

  currentPage = 'root';

  constructor(public alertCtrl: AlertController,
      public popoverCtrl: PopoverController,
      public navCtrl: NavController, public navParams: NavParams,
      @Inject('note') private noteService, @Inject('auth') authService) {
    const currentPage = navParams.get('currentPage');
    if (currentPage) {
      this.currentPage = currentPage;
    }
  }

  private loadFileList(did) {
    this.noteService.getFileList(did).subscribe(fileList => {
      if (fileList != null) {
        this.fileList = fileList;
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

  private showConfirm(msg, handler) {
    let confirm = this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: '取消',
          handler: () => {}
        },
        {
          text: '确定',
          handler: () => {
            handler();
          }
        }
      ]
    });
    confirm.present();
  }

  private sortFileList() {
    this.fileList.sort((a,b) => {
      const aType = a.type;
      const bType = b.type;
      if (aType === bType) {return 0;}
      else if (aType === this.DIR_STR && bType === this.NOTE_STR) {return -1;}
      else {return 1;}
    });
  }

  ionViewDidLoad() {
    this.loadFileList(this.currentPage);
  }

  tapToNextPage(file, $event) {
    if (file.type === this.DIR_STR) {
      this.navCtrl.push('FileListPage',{currentPage: file.did});
    }else {
      this.navCtrl.push('NotePage', {nid: file.nid});
    }
  }

  swipeToDelete(file, $event) {
    if (file.type === this.DIR_STR) {
      this.showConfirm('确定删除文件夹"' + file.dirName + '"吗?', () => {
          const dirIds = [];
          dirIds.push(file.did);
          this.noteService.deleteDir(dirIds).subscribe(changeNum => {
            if (changeNum !== -1) {
              let index = -1;
              this.fileList.forEach((loopFile, loopIndex) => {
                if (loopFile.type === this.DIR_STR && loopFile.did === file.did) {
                    index = loopIndex;
                  }
              });
              this.fileList = [...this.fileList.slice(0, index), ...this.fileList.slice(index + 1)];
              this.showAlert('删除成功！');
            }else {
              this.showAlert('删除失败！');
            }
          });
      });
    }else {
      this.showConfirm('确定删除笔记"' + file.title + '"吗?', () => {
        const noteIds = [];
        noteIds.push(file.nid);
        this.noteService.deleteNote(noteIds).subscribe(changeNum => {
          if (changeNum >= 1) {
            let index = -1;
            this.fileList.forEach((loopFile, loopIndex) => {
              if (loopFile.type === this.NOTE_STR && loopFile.nid === file.nid) {
                index = loopIndex;
              }
            });
            this.fileList = [...this.fileList.slice(0, index), ...this.fileList.slice(index + 1)];
            this.showAlert('删除成功！');
          }else {
            this.showAlert('删除失败！');
          }
        });
      });
    }
  }

  moveToTrash(file) {
    if (file.type === this.DIR_STR) {
      this.showConfirm('确定将文件夹"' + file.dirName + '"移入回收站吗?', () => {
        const dirIds = [];
        dirIds.push(file.did);
        this.noteService.moveDirsToTrash(dirIds).subscribe(changeNum => {
          if (changeNum >= 1) {
            let index = -1;
            this.fileList.forEach((loopFile, loopIndex) => {
              if (loopFile.type === this.DIR_STR && loopFile.did === file.did) {
                index = loopIndex;
              }
            });
            this.fileList = [...this.fileList.slice(0, index), ...this.fileList.slice(index + 1)];
            this.showAlert('成功移入回收站');
          }else {
            this.showAlert('移除失败');
          }
        });
      });
    }else {
      
    }
  }

  share(file) {
    this.noteService.share(file.nid).subscribe(result => {
      if (result.success) {
        this.showAlert('分享成功！');
      }else {
        this.showAlert(result.msg);
      }
    });
  }

  openCreatePopover($event) {
    const popoverRef = this.popoverCtrl.create(CreateNewFilePage);
    popoverRef.present({
      ev: $event
    });
    popoverRef.onDidDismiss((data) => {
      if (data) {
        if (data.dirName) {
          this.noteService.createNewDir(data.dirName, this.currentPage).subscribe(dir => {
            if (dir){
              this.fileList.push(dir);
              this.sortFileList();
            }else {
              this.showAlert('创建失败');
            }
          });
        }
        if (data.title) {
          this.noteService.createNewNote(data.title, this.currentPage).subscribe(note => {
            if (note){
              this.fileList.push(note);
              this.sortFileList();
            }else {
              this.showAlert('创建失败');
            }
          });
        }
      }
    })
  }

  refreshFileList(refresher) {
      this.loadFileList(this.currentPage);
      setTimeout(() => {
        refresher.complete();
      },1500);
      
  }

}

@Component({
  template: `
  <ion-list no-lines style="text-align: center;">
    <button ion-item (click)="createNewFolder()">新建文件夹</button>
    <button ion-item (click)="createNewNote()">新建笔记</button>
  </ion-list>
  `
})
export class CreateNewFilePage {
  constructor(public alertCtrl:AlertController, public viewCtrl: ViewController) {}

  createNewFolder() {
    const alert = this.alertCtrl.create({
      title: '',
      inputs: [
        {
          name: 'dirName',
          placeholder: '输入文件夹名称',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: '确定',
          handler: data => {
            this.viewCtrl.dismiss({
              dirName: data.dirName,
            });
          }
        }
      ]
    });
    alert.present();
  }

  createNewNote() {
    const alert = this.alertCtrl.create({
      title: '',
      inputs: [
        {
          name: 'title',
          placeholder: '输入笔记标题',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: '确定',
          handler: data => {
            this.viewCtrl.dismiss({
              title: data.title,
            });
          }
        }
      ]
    });
    alert.present();
  }
  
}
