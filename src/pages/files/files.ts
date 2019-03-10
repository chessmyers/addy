import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ModalController} from "ionic-angular";
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
  selector: 'page-files',
  templateUrl: 'files.html',
})
export class FilesPage {

  profileOptions: any;
  userName: string;
  userNameConstant: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private authServ: AuthService, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.profileOptions = 'profile';
    this.loadProfileSettings();
  }

  onLogOut() {
    let alert = this.alertCtrl.create({
      title: "Log Out?",
      subTitle: "Are you sure you wish to log out?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.authServ.logOut()
              .then(() => {
                let toast = this.toastCtrl.create({
                  message: "You have been logged out successfully",
                  duration: 3000
                }).present();
              }).catch((err) => {
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 3000
              }).present();
            })
          }
        }
      ]
    });
    alert.present();
  }

  onDeleteAccount() {
    let alert = this.alertCtrl.create({
      title: "Delete Account?",
      subTitle: "Are you sure you want to delete your account?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.authServ.deleteAccount()
              .then(() => {
                let toast = this.toastCtrl.create({
                  message: "Your account has been deleted successfully",
                  duration: 3000
                }).present();
              }).catch(function (error) {
              let toasty = this.toastCtrl.create({
                message: error.message,
                duration: 3000
              }).present();
            });

          }
        }
      ]
    });
    alert.present();

  }

  loadProfileSettings() {
    this.authServ.getActiveUserData().get().then((doc) => {
        this.userName = doc.data().username;
        this.userNameConstant = this.userName;
      }).catch((err) => {
        this.toastCtrl.create({
          message: "Trouble loading user data",
          duration: 3000
        }).present();
    });
  }

  onSaveChanges() {
    // update username
    if (this.userName == this.userNameConstant) {
      this.toastCtrl.create({
        message: "You haven't changed your username!",
        duration: 3000
      }).present();
    } else {
      let checkQuery = this.authServ.getSameNameUser(this.userName);
      checkQuery.get().then((docs) => {
        if (docs.empty) {
          // unique new username
          this.authServ.getActiveUserData().update({
            username: this.userName
          }).then(() => {
            this.toastCtrl.create({
              message: "Username successfully updated to " + this.userName,
              duration: 3000
            }).present();
            this.userNameConstant = this.userName;
          }).catch((err) => {
            this.toastCtrl.create({
              message: "Problem updating username.  Try again in a minute or check your connection",
              duration: 3000
            }).present();
          })

        } else {
          // username already exists
          this.alertCtrl.create({
            title: 'Username already in use',
            subTitle: "That username has already been take.  Try a different one",
            buttons: ['Ok']
          }).present();
        }
      }).catch((err) => {
        this.toastCtrl.create({
          message: "Problem updating username.  Try again in a minute or check your connection",
          duration: 3000
        }).present();
      });
    }
  }

}
