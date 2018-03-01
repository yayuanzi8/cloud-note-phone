import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Auth } from './entities';

export class RequestResult {
    code: number;
    msg: string;
    data?: any;
}

@Injectable()
export class AuthService {

    private headers = new Headers();

    private auth: Auth;

    subject: ReplaySubject<Auth> = new ReplaySubject<Auth>(1);

    constructor(public http: Http, public loadingCtrl: LoadingController) {
        this.headers.append('Content-Type', 'application/json');
        this.auth = new Auth();
        this.auth.loginDate = null;
        this.auth.token = '';
        this.auth.pass = false;
        this.auth.expDuration = null;
        this.auth.user = null;
        this.subject.next(this.auth);
    }

    private handleError(): Observable<any> {
        const auth = new Auth();
        auth.loginDate = null;
        auth.token = '';
        auth.pass = false;
        auth.expDuration = null;
        auth.user = null;
        this.subject.next(auth);
        return this.subject.asObservable();
    }

    login(username, password): Observable<Auth> {
        const loadingRef = this.loadingCtrl.create({
            content: '登录中...',
            enableBackdropDismiss: false,
        });
        loadingRef.present();
        return this.http.post('http://localhost:8080/user/auth', JSON.stringify({
            username: username,
            password: password
        }), {headers: this.headers}).map(res => {
            const auth = new Auth();
            if (res.json().code === 20000) {
                auth.token = 'Bearer ' + res.json().token;
                auth.pass = true;
                auth.loginDate = new Date();
                auth.expDuration = res.json().expDuration;
                auth.user = res.json().jwtUser;
                auth.errorMsg = null;
            }else {
                auth.loginDate = null;
                auth.token = '';
                auth.pass = false;
                auth.expDuration = null;
                auth.user = null;
                auth.errorMsg = res.json().msg;
            }
            this.auth = Object.assign({},auth);
            localStorage.setItem('auth', JSON.stringify(this.auth));
            this.subject.next(this.auth);
            loadingRef.dismiss();
            return auth;
        }).catch(this.handleError);
    }

    getAuth(): Observable<Auth> {
        const authString = localStorage.getItem('auth');
        let auth;
        if (authString != null){
            auth = JSON.parse(authString);
            this.auth = Object.assign({}, auth);
            this.subject.next(auth);
        }
        return this.subject.asObservable();
    }

    loginUserInfo(): Observable<any> {
        const loadingRef = this.loadingCtrl.create({
            content: '加载用户信息中...',
            enableBackdropDismiss: false,
        });
        loadingRef.present();
        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', this.auth.token);
        return this.http.get('http://localhost:8080/user/loginUserInfo', {headers: headers}).map(res => {
            let userInfo = null;
            if (res.json().code === 20000) {
                const resUser = res.json();
                userInfo = {
                    uid: resUser.uid,
                    username: resUser.username,
                    registerTime: resUser.registerTime,
                    portrait: resUser.portrait,
                    email: resUser.email
                };
            }
            loadingRef.dismiss();
            return userInfo;
        }).catch(() => {
            loadingRef.dismiss();
            return null;
        })
    }

    sendEmail(email): Observable<string> {
        const loadingRef = this.loadingCtrl.create({
            content: '发送验证码中...',
            enableBackdropDismiss: false,
        });
        loadingRef.present();
        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', this.auth.token);
        return this.http.post('http://localhost:8080/user/sendRegisterEmail', JSON.stringify({
            email: email,
        }), {headers: headers}).map(res => {
            loadingRef.dismiss();
            return res.json().msg;
        }).catch(() => {
            loadingRef.dismiss();
            return '邮件发送出错';
        });
    }

    changeEmail(email, code): Observable<RequestResult> {
        const loadingRef = this.loadingCtrl.create({
            content: '修改邮箱中...',
            enableBackdropDismiss: false,
        });
        loadingRef.present();
        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', this.auth.token);
        return this.http.patch('http://localhost:8080/user/changeEmail', JSON.stringify({
            newemail: email,
            code: code
        }), {headers: headers}).map(res => {
            loadingRef.dismiss();
            if (res.json().code === 20000) {
                return {code: 20000, msg: '修改成功'};
            }else {
                return {code: res.json().code, msg: res.json().msg};
            }
        });
    }

    changePsw(oldPsw, newPsw): Observable<RequestResult> {
        const loadingRef = this.loadingCtrl.create({
            content: '修改密码中...',
            enableBackdropDismiss: false,
        });
        loadingRef.present();
        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', this.auth.token);
        return this.http.patch('http://localhost:8080/user/changePsw', JSON.stringify({
            oldpsw: oldPsw,
            newpsw: newPsw
        }), {headers: headers}).map(res => {
            loadingRef.dismiss();
            if (res.json().code === 20000) {
                return {code: 20000, msg: '修改成功！'};
            }else {
                return {code: res.json().code, msg: res.json().msg};
            }
        });
    }

    unAuth() {
        const auth = new Auth();
        auth.loginDate = null;
        auth.token = '';
        auth.pass = false;
        auth.expDuration = null;
        auth.user = null;
        this.subject.next(auth);
        localStorage.setItem('auth', JSON.stringify(this.auth));
        return this.subject.asObservable();
    }

}