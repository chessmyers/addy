import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Post } from "../../models/post";
import { PostviewPage } from "../subpages/postview/postview";
import {AddpostPage} from "../subpages/addpost/addpost";
import { PostingService } from "../../services/posting";

import firebase from 'firebase';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  posts: Post[];
  postView: any = PostviewPage;
  infiniteEvent: any;
  cursor: any;
  pageSize: number = 5;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private loadingCtrl: LoadingController, private postServ: PostingService) {

    /*this.posts = [
      new Post("Content for the next exam??", "So what do you think will be covered?? I'm worried :(","Philosophy 101", "Jared Doe"),
      new Post("Opinion of this class?","What's your guys opinion about this course? I think he's such a good teacher :]","Discrete Stuctures", "Julie Doe"),
      new Post("Homework #6 Problem 3!!!", "Guys!! I'm can't seem to figure out how to do this one. Any advice, without giving me the answer (obviously)?", "Economics 101", "Josh Doe"),
      new Post("Content for the next exam??", "So what do you think will be covered?? I'm worried :(","Philosophy 101", "Jared Doe"),
      new Post("Opinion of this class?","What's your guys opinion about this course? I think he's such a good teacher :]","Discrete Stuctures", "Julie Doe"),
      new Post("Homework #6 Problem 3!!!", "Guys!! I'm can't seem to figure out how to do this one. Any advice, without giving me the answer (obviously)?", "Economics 101", "Josh Doe")
    ]*/
    this.getPosts();

  }

  ionViewDidLoad() {
    this.infiniteEvent = this.postServ.infiniteEvent;
  }


openPost(post) {
    console.log(post);
    this.navCtrl.push(this.postView, post);
}

  addPostModal() {
    const addPost = this.modalCtrl.create(AddpostPage, {modalData: null});
    addPost.onDidDismiss(() => {
      this.posts = [];
      this.getPosts();
    });
    addPost.present();
  }


  getPosts() {

    this.posts = [];

    let loading = this.loadingCtrl.create({
      content: "Loading posts..."
    });
    loading.present();

    let query = firebase.firestore().collection("posts").orderBy("created", "desc")
      .limit(this.pageSize);

    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(new Post(doc.data().title, doc.data().content, doc.data().classFor, doc.data().poster,
            doc.data().poster_name, doc.data().created, doc.data().image, doc.id));
        });
        loading.dismiss();
        this.cursor = this.posts[this.posts.length - 1];
      }).catch((err) => {
        console.log(err);
    })
    console.log(this.posts);
  }

  loadMorePosts(event) {
    firebase.firestore().collection("posts").orderBy("created", "desc")
      .startAfter(this.cursor).limit(this.pageSize).get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(new Post(doc.data().title, doc.data().content, doc.data().classFor, doc.data().poster, doc.data().poster_name, doc.data().created, doc.data().image, doc.id));
        });
        if (docs.size < this.pageSize) {
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }
      }).catch((err) => {
        console.log(err);
    })
  }

  refresh(event) {
    this.posts = [];
    this.getPosts();
    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }

    event.complete();
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }


}
