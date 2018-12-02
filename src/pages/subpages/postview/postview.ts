import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-postview',
  templateUrl: 'postview.html',
})
export class PostviewPage {

  private title: String;
  private content: String;
  private clasFor: String;
  private poster: String;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

 ionViewWillEnter() {
   let data = this.navParams.data;
   this.title = data.title;
   this.content = data.content;
   this.clasFor = data.clasFor;
   this.poster = data.poster;
 }

}
