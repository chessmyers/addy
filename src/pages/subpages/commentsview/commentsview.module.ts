import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsviewPage } from './commentsview';

@NgModule({
  declarations: [
    CommentsviewPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentsviewPage),
  ],
})
export class CommentsviewPageModule {}
