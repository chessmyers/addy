import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ClassviewPage } from "../subpages/classview/classview";
import {AddclassPage } from "../subpages/addclass/addclass";
import { Student } from "../../models/student";

@IonicPage()
@Component({
  selector: 'page-classes',
  templateUrl: 'classes.html',
})
export class ClassesPage {

  classView: any;
  classes: any;
  searchQuery: string = '';

  constructor(private navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.classView = ClassviewPage;
    this.classes = [
      {
        name: "History 2000",
        professor: "Professor Foo",
        term: "Fall 2018",
        students: [
          new Student("John Doe", "doe.john@husky.neu.edu",true),
          new Student("Jane Doe", "doe.jane@husky.neu.edu",false)]
      },
      {
        name: "Chemistry 1234",
        professor: "Professor Bar",
        term: "Fall 2018",
        students: [
          new Student("John Doe", "doe.john@husky.neu.edu",false),
          new Student("Jane Doe", "doe.jane@husky.neu.edu",true),
          new Student("Jim Doe", "doe.jim@husky.neu.edu",false),
          new Student("Janet Doe", "doe.janet@husky.neu.edu",false)]
      },
      {
        name: "Biology 1001",
        professor: "Professor Baz",
        term: "Spring 2018",
        students: [
          new Student("John Doe", "doe.john@husky.neu.edu",true),
          new Student("Joyce Doe", "doe.joyce@husky.neu.edu",false),
          new Student("Jill Doe", "doe.jill@husky.neu.edu",true)]
      }
    ]
  }

addClass() {
  const modal = this.modalCtrl.create(AddclassPage);
  modal.present();
}

editClasses() {
    console.log("Edit");
}

viewClass(clas) {
    this.navCtrl.push(this.classView, clas)
}

searchClasses(event: any) {
    const val = event.target.value;
    console.log(val);
}


}
