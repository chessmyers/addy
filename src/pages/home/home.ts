import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SigninupPage } from "../signinup/signinup";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  signIn = SigninupPage;

  constructor(public navCtrl: NavController) {

  }

}
