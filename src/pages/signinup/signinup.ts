import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { AuthService } from "../../services/auth";
import {AlertController, LoadingController, ToastController} from "ionic-angular";
import { PostingService } from "../../services/posting";

@Component({
  selector: 'page-signinup',
  templateUrl: 'signinup.html',
})
export class SigninupPage {

  constructor(private authService: AuthService, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private toastCtrl: ToastController, private postServ: PostingService) {
    this.signing = 'signup';
  }

  signing: any;

  onSignUp(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: "Signing you up..."
    });
    loading.present();

    let checkQuery = this.authService.getSameNameUser(form.value.username);
    checkQuery.get().then((docs) => {
      if (docs.empty) {
        if (this.authService.checkEmail(form.value.email)) {
          // unique username
          this.authService.signUp(form.value.email, form.value.password)
            .then((data) => {
              this.authService.addNewUser(form.value.username).then((doc) => {
                console.log(doc);
              }).catch((err) => {
                console.log(err);
              });
              loading.dismiss();
              this.toastCtrl.create({
                message: "Welcome to addy, " + form.value.username + "!",
                duration: 3000
              }).present();
            })
            .catch(error => {
              loading.dismiss();
              const alert = this.alertCtrl.create({
                title: "Signup failed!",
                message: error.message,
                buttons: ['Ok']
              });
              alert.present();
            });
        } else {
          this.alertCtrl.create({
            title: "Invalid Email",
            message: "This email does not belong to a supported institution",
            buttons: ['Ok']
          })
        }
      } else {
        // username already exists
        this.alertCtrl.create({
          title: 'Username already in use',
          subTitle: "That username has already been taken.  Try a different one",
          buttons: ['Ok']
        }).present();
      }
    }).catch((err) => {
      this.alertCtrl.create({
        title: "Signup failed!",
        message: err.message,
        buttons: ['Ok']
      }).present();
    });
    loading.dismiss();
  }

  onSignIn(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: "Signing you in..."
    });
    loading.present();
    this.authService.signIn(form.value.email, form.value.password)
      .then(data => {
        console.log(data);
        loading.dismiss();
        this.toastCtrl.create({
          message: "Sign in successful",
          duration: 3000
        }).present();
      })
      .catch(error => {
        console.log(error);
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: "Signing in failed!",
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }


}
