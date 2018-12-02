import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddfilePage } from './addfile';

@NgModule({
  declarations: [
    AddfilePage,
  ],
  imports: [
    IonicPageModule.forChild(AddfilePage),
  ],
})
export class AddfilePageModule {}
