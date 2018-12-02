import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddpostPage } from './addpost';

@NgModule({
  declarations: [
    AddpostPage,
  ],
  imports: [
    IonicPageModule.forChild(AddpostPage),
  ],
})
export class AddpostPageModule {}
