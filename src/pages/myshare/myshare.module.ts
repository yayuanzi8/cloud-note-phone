import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MysharePage } from './myshare';

@NgModule({
  declarations: [
    MysharePage,
  ],
  imports: [
    IonicPageModule.forChild(MysharePage),
  ],
})
export class MysharePageModule {}
