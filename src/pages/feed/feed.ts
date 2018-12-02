import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Post } from "../../models/post";
import { PostviewPage } from "../subpages/postview/postview";
import {AddpostPage} from "../subpages/addpost/addpost";

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  posts: any;
  postView: any = PostviewPage

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {

    this.posts = [
      new Post("Content for the next exam??", "So what do you think will be covered?? I'm worried :(","Philosophy 101", "Jared Doe"),
      new Post("Opinion of this class?","What's your guys opinion about this course? I think he's such a good teacher :]","Discrete Stuctures", "Julie Doe"),
      new Post("Homework #6 Problem 3!!!", "Guys!! I'm can't seem to figure out how to do this one. Any advice, without giving me the answer (obviously)?", "Economics 101", "Josh Doe"),
      new Post("Content for the next exam??", "So what do you think will be covered?? I'm worried :(","Philosophy 101", "Jared Doe"),
      new Post("Opinion of this class?","What's your guys opinion about this course? I think he's such a good teacher :]","Discrete Stuctures", "Julie Doe"),
      new Post("Homework #6 Problem 3!!!", "Guys!! I'm can't seem to figure out how to do this one. Any advice, without giving me the answer (obviously)?", "Economics 101", "Josh Doe")
    ]

  }

openPost(post) {
    console.log(post);
    this.navCtrl.push(this.postView, post);
}

  addPostModal() {
    const addPost = this.modalCtrl.create(AddpostPage);
    addPost.present();
  }


}
