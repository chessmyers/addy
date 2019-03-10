import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninupPage } from './signinup';

@NgModule({
  declarations: [
    SigninupPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninupPage),
  ],
})
export class SigninupPageModule {}
