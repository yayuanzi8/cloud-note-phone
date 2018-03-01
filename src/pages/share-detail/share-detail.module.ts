import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareDetailPage } from './share-detail';

@NgModule({
  declarations: [
    ShareDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareDetailPage),
  ],
})
export class ShareDetailPageModule {}
