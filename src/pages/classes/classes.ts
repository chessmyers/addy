import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ClassviewPage } from "../subpages/classview/classview";
import { AddclassPage } from "../subpages/addclass/addclass";
import { Clas } from "../../models/clas";

import {PostingService} from "../../services/posting";

@IonicPage()
@Component({
  selector: 'page-classes',
  templateUrl: 'classes.html',
})
export class ClassesPage {

  classView: any;
  classAdd: any;

  classes: Clas[] = [];
  searchQuery: string = '';

  showHelp: boolean = false; // checks if classes are being loading to know if to display empty list message

  constructor(private navCtrl: NavController, public navParams: NavParams,
              private modalCtrl: ModalController, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private toastCtrl: ToastController, private postServ: PostingService) {

    this.classView = ClassviewPage;
    this.classAdd = AddclassPage;

    this.loadClasses();
  }

addClass() {
  const modal = this.modalCtrl.create(this.classAdd);
  modal.onDidDismiss(() => {
    this.loadClasses();
  });
  modal.present();
}

viewClass(clas) {
    this.navCtrl.push(this.classView, clas)
}

searchClasses(event: any) {
    const val = event.target.value;
    console.log(val);
}

  loadClasses() {
    this.classes = [];
    let loading = this.loadingCtrl.create({
      content: "Loading classes..."
    });
    loading.present();

    let query = this.postServ.getMyClasses();

    query.then((doc) => {
        let classList = this.postServ.myClassQuery();
        (doc.data().classes).forEach((value) => {
          classList.doc(value).get()
            .then((doc) => {
              let clas = new Clas(doc.data().fullName, doc.data().identifier, doc.data().professor, doc.data().subject,
                doc.data().abbvr, doc.data().type, doc.data().units, doc.data().students,
                doc.data().subjectAbbvr.concat(doc.data().identifier));
              this.classes.push(clas);
            }).catch((err) => {
            console.log(err);
          })
        });
      }).catch((err) => {
      console.log(err);
    });
    loading.dismiss();
  }

  removeClass(clas: Clas) {
    let user = this.postServ.getUser();
    let alert = this.alertCtrl.create({
      title: "Remove class?",
      subTitle: "Are you sure you want to unenroll from " + clas.fullName + "?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.postServ.removeStudentFromClass(clas.id, user).then(() => {
              this.postServ.removeClassFromStudent(clas.id, user).then(() => {
                this.toastCtrl.create({
                  message: "You have been successfully removed from " + clas.id + ": " + clas.fullName,
                  duration: 3000
                }).present();
                this.loadClasses();
              }).catch((err) => {
                this.toastCtrl.create({
                  message: err.message,
                  duration: 3000
                }).present();
              })
            }).catch((err) => {
              this.toastCtrl.create({
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

  refresh(event) {
    this.loadClasses();
    event.complete();
  }

  profString(prof: string): string {
    return prof.includes(",") ? "Professors " + prof : "Professor " + prof;
  }

  studentString(studs: number): string {
    return studs > 1 ? studs.toString() + " students enrolled" : studs.toString() + " student enrolled";
  }


}
