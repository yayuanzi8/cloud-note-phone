import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker'
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { MediaCapture } from '@ionic-native/media-capture';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login'
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './auth.service';
import { NoteService } from './note.service';
import { CreateNewFilePage } from '../pages/file-list/file-list';
import { FunctionsPage } from '../pages/note/note';
import { ChangeEmailModal, ChangePswModal } from '../pages/profile-detail/profile-detail';
import { ImageService } from './image.service';
import { NoticeService } from './notice.service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    CreateNewFilePage,
    FunctionsPage,
    ChangeEmailModal,
    ChangePswModal
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    CreateNewFilePage,
    FunctionsPage,
    ChangeEmailModal,
    ChangePswModal
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    Camera,
    File,
    ImagePicker,
    FileTransfer,
    MediaCapture,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: 'auth',useClass:AuthService},
    {provide: 'note', useClass: NoteService},
    {provide: 'image', useClass: ImageService},
    {provide: 'notice', useClass: NoticeService}
  ]
})
export class AppModule {}
