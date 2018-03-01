import { NgModule } from '@angular/core';
import { RichTextComponent } from './rich-text/rich-text';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [RichTextComponent],
	imports: [IonicModule],
	exports: [RichTextComponent]
})
export class ComponentsModule {}
