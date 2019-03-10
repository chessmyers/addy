import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import firebase from "firebase";
import {Clas} from "../../../models/clas";
import {PostingService} from "../../../services/posting";

@IonicPage()
@Component({
  selector: 'page-addclass',
  templateUrl: 'addclass.html',
})
export class AddclassPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, private postingServ: PostingService) {

    this.getClasses();
  }

  classList: Clas[] = [];
  classListCopy: Clas[] = [];
  schoolID: string;
  term: string;

  getClasses() {
    let loading = this.loadingCtrl.create({
      content: "Loading classes..."
    });
    loading.present();

    let query = this.postingServ.getClasses();

    query.then((docs) => {
        docs.forEach((doc) => {
          let clas = new Clas(doc.data().fullName, doc.data().identifier, doc.data().professor, doc.data().subject,
            doc.data().abbvr, doc.data().type, doc.data().units, doc.data().students,
            doc.data().subjectAbbvr.concat(doc.data().identifier));
          this.classList.push(clas);
        });
        loading.dismiss();
      }).catch((err) => {
        console.log("Error" + err);
    })
    console.log(this.classList);
    this.classListCopy = this.classList;

  }

  chooseClass(clas: Clas) {
    let user = this.postingServ.getUser();
    let alert = this.alertCtrl.create({
      title: "Add class?",
      subTitle: "Are you sure you want to add " + clas.fullName+ "?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.postingServ.getClass(clas.id).get().then((doc) => {
                if ((doc.data().students).includes(user.uid)) {
                  // user is already in this class
                  this.alertCtrl.create({
                    title: "Already in class!",
                    subTitle: 'You are already enrolled in this class',
                    buttons: ['Ok']
                  }).present();
                } else {
                  // user is not yet in class
                 this.postingServ.getClass(clas.id).update({ // add student to class
                    students: firebase.firestore.FieldValue.arrayUnion(user.uid)
                  }).then(() => { // add class to student
                    this.postingServ.getStudent(user.uid).update({
                      classes: firebase.firestore.FieldValue.arrayUnion(clas.id)
                    }).then(() => {
                      this.toastCtrl.create({
                        message: "You have been successfully added to " + clas.id + ": " + clas.fullName,
                        duration: 3000
                      }).present();
                      this.navCtrl.pop();
                    }).catch((error) => {
                      this.toastCtrl.create({
                        message: error.message,
                        duration: 3000
                      }).present();
                    })
                  }).catch(function (error) {
                    this.toastCtrl.create({
                      message: error.message,
                      duration: 3000
                    }).present();
                  });
                }
              }).catch((err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    alert.present();
  }

  profString(prof: string): string {
    return prof.includes(",") ? "Professors " + prof : "Professor " + prof;
  }

  studentString(studs: number): string {
    return studs > 1 ? studs.toString() + " students enrolled" : studs.toString() + " student enrolled";
  }

  filterClasses(event) {
    this.classList = this.classListCopy;
    let searchTerm: string = event.target.value;

    // dont filter values if searchTerm is empty
    if (searchTerm && searchTerm.trim() != '') {
      this.classList = this.classList.filter((clas: Clas) => {
        return (clas.fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
          || (clas.id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
          || (clas.professor.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      })
    }
  }

}
