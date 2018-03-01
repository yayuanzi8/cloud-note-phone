import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Auth, Note, Directory, Share } from './entities';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class NoteService {

    private BASE_URL = 'http://localhost:8080/note';

    private headers = new Headers();

    constructor(public http: Http, @Inject('auth') private authService, public loadingCtrl: LoadingController) {
        this.headers.set('Content-Type', 'application/json');
        this.authService.getAuth().subscribe((auth: Auth) => {
            this.headers.set('Authorization', auth.token);
        });
    }

    getFileList(did:string): Observable<any> {
        const loadRef = this.loadingCtrl.create({
            content: '加载列表中...'
        });
        loadRef.present();
        return this.http.get(this.BASE_URL + '/fileList/'+ did, {headers: this.headers}).map(res => {
            let fileSet = null;
            if (res.json().code === 20000) {
                fileSet = res.json().fileSet;
            }
            loadRef.dismiss();
            return fileSet;
        });
    }

    loadNote(nid: string): Observable<Note> {
        const loadRef = this.loadingCtrl.create({
            content: '加载笔记中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.get(this.BASE_URL + '/usernote/' + nid, {headers: this.headers}).map(res => {
            let note = null;
            if (res.json().code === 20000) {
                note  = new Note();
                note.nid = res.json().note.nid;
                note.title = res.json().note.title;
                note.content = res.json().note.content;
            }
            loadRef.dismiss();
            return note;
        });
    }

    createNewDir(dirName, parent): Observable<Directory> {
        const loadRef = this.loadingCtrl.create({
            content: '创建文件夹中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/newDir', JSON.stringify({
            dir: dirName,
            parent: parent
        }),{headers: this.headers}).map(res => {
            let dir = null;
            if (res.json().code === 20000) {
                dir = new Directory();
                dir.did = res.json().dir.did;
                dir.dirName = res.json().dir.dirName;
                dir.parent = res.json().dir.parent;
                dir.createTime = res.json().dir.createTime;
                dir.type = res.json().dir.type;
            }
            loadRef.dismiss();
            return dir;
        });
    }

    createNewNote(title, parent): Observable<Note> {
        const loadRef = this.loadingCtrl.create({
            content: '创建笔记中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/newNote', JSON.stringify({
            title: title,
            parent: parent
        }),{headers: this.headers}).map(res => {
            let note = null;
            if (res.json().code === 20000) {
                note = new Note();
                const resNote = res.json().note;
                note.nid = resNote.nid;
                note.title = resNote.title;
                note.parent = resNote.parent;
                note.createTime = resNote.createTime;
                note.type = resNote.type;
            }
            loadRef.dismiss();
            return note;
        });
    }

    deleteDir(dirIds:string[]): Observable<any> {
        const loadRef = this.loadingCtrl.create({
            content: '删除文件夹中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/delete', JSON.stringify({
            dirs: dirIds
        }), {headers: this.headers}).map(res => {
            loadRef.dismiss();
            if (res.json().code === 20000) {
                return res.json().changeNum;
            }
            return -1;
        });
    }

    deleteNote(noteIds:string[]) {
        const loadRef = this.loadingCtrl.create({
            content: '删除文件夹中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/delete', JSON.stringify({
            notes: noteIds
        }), {headers: this.headers}).map(res => {
            loadRef.dismiss();
            if (res.json().code === 20000) {
                return res.json().changeNum;
            }
            return -1;
        });
    }

    share(nid): Observable<any> {
        const loadRef = this.loadingCtrl.create({
            content: '分享笔记中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/share', JSON.stringify({
            nid: nid
        }),{headers: this.headers}).map(res => {
            loadRef.dismiss();
            if (res.json().code === 20000) {
                return {success: true,sid: res.json().sid};
            }
            return {success: false, msg: res.json().msg};
        })
    }

    savaNote(nid, title, content): Observable<Note> {
        const loadRef = this.loadingCtrl.create({
            content: '保存笔记中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/update', JSON.stringify({
            nid: nid,
            title: title,
            content: content
        }), {headers: this.headers}).map(res => {
            let note = null;
            loadRef.dismiss();
            if (res.json().code === 20000) {
                note = new Note();
                const resNote = res.json().note;
                note.nid = resNote.nid;
                note.title = resNote.title;
                note.parent = resNote.parent;
                note.createTime = resNote.createTime;
                note.type = resNote.type;
            }
            return note;
        });
    }

    getMyShare(): Observable<Share[]> {
        const loadRef = this.loadingCtrl.create({
            content: '加载分享列表中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.get(this.BASE_URL + '/myShare', {headers: this.headers}).map(res => {
            let shareList = [];
            loadRef.dismiss();
            if (res.json().code === 20000) {
                const resShareList = res.json().shareList;
                resShareList.forEach(share => {
                    const tempShare = new Share();
                    tempShare.nid = share.nid;
                    tempShare.sid = share.sid;
                    tempShare.title = share.title;
                    tempShare.shareDate = share.shareDate;
                    shareList.push(tempShare);
                });
            }
            return shareList;
        })
    }

    getShareDetails(sid): Observable<Note> {
        const loadRef = this.loadingCtrl.create({
            content: '加载笔记中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.get(this.BASE_URL + '/share/' + sid, {}).map(res => {
            let note = null;
            if (res.json().code === 20000) {
                note = new Note();
                const resNote = res.json().note;
                note.nid = resNote.nid;
                note.title = resNote.title;
                note.content = resNote.content;
                note.createTime = resNote.createTime;
            }
            loadRef.dismiss();
            return note;
        });
    }

    cancelShare(sid): Observable<number> {
        const loadRef = this.loadingCtrl.create({
            content: '取消分享中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.patch(this.BASE_URL + '/cancelShare', JSON.stringify({
            sid: sid,
        }), {headers: this.headers}).map(res => {
            loadRef.dismiss();
            let changeNum = -1;
            if (res.json().code === 20000) {
                changeNum = res.json().changeNum;
            }
            return changeNum;
        });
    }

    getMyTrashList() {
        const loadRef = this.loadingCtrl.create({
            content: '加载回收站中...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.get(this.BASE_URL + '/myRubbish', {headers: this.headers}).map(res => {
            let rubbishes = null;
            if (res.json().code === 20000) {
                rubbishes = res.json().rubbishes;
            }
            loadRef.dismiss();
            return rubbishes;
        });
    }

    moveDirsToTrash(dirIds): Observable<number> {
        const loadRef = this.loadingCtrl.create({
            content: '正在移入回收站...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/toRubbish', JSON.stringify({
            dirs: dirIds,
        }), {headers: this.headers}).map(res => {
            loadRef.dismiss();
            let changeNum = -1;
            if (res.json().code === 20000) {
                changeNum = res.json().changeNum;
            }
            return changeNum;
        });
    }

    recover(rid): Observable<number> {
        const loadRef = this.loadingCtrl.create({
            content: '正在恢复...',
            enableBackdropDismiss: false,
        });
        loadRef.present();
        return this.http.post(this.BASE_URL + '/recover', JSON.stringify({
            rid: rid,
        }), {headers: this.headers}).map(res => {
            loadRef.dismiss();
            let changeNum = -1;
            if (res.json().code === 20000) {
                changeNum = res.json().changeNum;
            }
            return changeNum;
        });
    }

}