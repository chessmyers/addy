import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddfilePage } from "../addfile/addfile";
import { AddpostPage } from "../addpost/addpost";
import { Post } from "../../../models/post";


@IonicPage()
@Component({
  selector: 'page-classview',
  templateUrl: 'classview.html',
})
export class ClassviewPage {

classPages: any;

 private students: any;
 private professor: String;
 private className: String;
 private term: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.classPages = 'posts';
  }

  ionViewWillEnter() {
    let data = this.navParams.data;
    console.log(data);
    this.students = data.students;
    this.professor = data.professor;
    this.className = data.name;
    this.term = data.term;
    console.log(this.students)
  }

  addFileModal() {
    const addFiles = this.modalCtrl.create(AddfilePage);
    addFiles.present();
  }

  addPostModal() {
    const addPost = this.modalCtrl.create(AddpostPage);
    addPost.present();
  }

}
