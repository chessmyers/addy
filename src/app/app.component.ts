import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { TabsPage } from '../pages/tabs/tabs';
import { SigninupPage } from "../pages/signinup/signinup";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninupPage;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    firebase.initializeApp({
      apiKey: "AIzaSyAvOOWQOS5_Y0kVZjLF1GIjVj9TRPgHAxk",
      authDomain: "addy-b7f74.firebaseapp.com",
      databaseURL: "https://addy-b7f74.firebaseio.com",
      projectId: "addy-b7f74",
      storageBucket: "addy-b7f74.appspot.com",
      messagingSenderId: "97967079972"
    });
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.isAuthenticated = true;
          //this.nav.setRoot(this.tabsPage);
          this.rootPage = TabsPage;
          console.log("Authenticated")
        } else {
          this.isAuthenticated = false;
          //this.nav.setRoot(this.signingPage);
          this.rootPage = SigninupPage;
          console.log("Not authenticated");
        }
    })
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
