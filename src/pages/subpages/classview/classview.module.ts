import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassviewPage } from './classview';

@NgModule({
  declarations: [
    ClassviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassviewPage),
  ],
})
export class ClassviewPageModule {}
