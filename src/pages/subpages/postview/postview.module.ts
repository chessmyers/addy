import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostviewPage } from './postview';

@NgModule({
  declarations: [
    PostviewPage,
  ],
  imports: [
    IonicPageModule.forChild(PostviewPage),
  ],
})
export class PostviewPageModule {}
