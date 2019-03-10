import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FileviewPage } from './fileview';

@NgModule({
  declarations: [
    FileviewPage,
  ],
  imports: [
    IonicPageModule.forChild(FileviewPage),
  ],
})
export class FileviewPageModule {}
