import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { NotePage } from './note';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    NotePage,
  ],
  imports: [
    IonicPageModule.forChild(NotePage),
    ComponentsModule,
  ]
})
export class NotePageModule {}
