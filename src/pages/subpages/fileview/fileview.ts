import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Upload } from "../../../models/upload";
import moment from "moment";

@IonicPage()
@Component({
  selector: 'page-fileview',
  templateUrl: 'fileview.html',
})
export class FileviewPage {

  name: string;
  description: string;
  category: string;
  url: string;
  posterId: string;
  posterName: string;
  created: any;



  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let file:Upload = this.navParams.data;
    this.name = file.name;
    this.description = file.description;
    switch (file.category) {
      case "study": this.category = "Study Guide"; break;
      case "homework": this.category = "Old Homework"; break;
      case "quiz": this.category = "Old Quiz"; break;
      case "test": this.category = "Old Test"; break;
      case "syllabus": this.category = "Old Syllabus"; break;
      case "other": default: this.category = "Other File"; break;
    }
    this.url = file.url;
    this.posterId = file.poster;
    this.posterName = file.posterName;
    this.created = file.created;
  }

  formatCreatedDate(time) {
    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
  }



}
