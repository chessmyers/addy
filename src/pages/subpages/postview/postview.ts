import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post } from "../../../models/post";
import { Comment } from "../../../models/comment";
import { PostingService } from "../../../services/posting";

import moment from 'moment';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-postview',
  templateUrl: 'postview.html',
})
export class PostviewPage {

  title: string;
  content: string;
  classFor: string = "";
  posterName: string;
  postCreated: any;
  posterId: string;
  postId: string;
  image: any;
  comments: Comment[] = [];

  courseId: string;
  myId: string;

  commentBoxText: string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams, private postServ: PostingService) {
    let stuff = this.navParams.data;
    this.title = stuff[0].title;
    this.content = stuff[0].content;
    this.classFor = stuff[0].classFor;
    this.posterId = stuff[0].poster;
    this.posterName = stuff[0].poster_name;
    this.postCreated = stuff[0].created;
    this.image = stuff[0].image;
    this.postId = stuff[0].id;
    this.courseId = stuff[1];
    this.myId = firebase.auth().currentUser.uid;
    let query = this.postServ.getComments(this.courseId, this.postId); // get comments
    query.then((comments) => {
      comments.forEach((comment) => {
        let tempcomm = new Comment(comment.data().text, comment.data().posterName,
          comment.data().posterId, comment.data().time);
        this.comments.push(tempcomm);

      });
      console.log(this.comments);
    }).catch((errPostView) => {
      console.log({errPostView});
    })
  }

  formatCreatedDate(time, type: number) {
    if (type == 1) { // top of post
      return moment(time).format('MMMM Do YYYY, h:mm:ss a');
    } else if (type == 2) { // inside comments
      let difference = moment(time).diff(moment());
      return moment.duration(difference).humanize();
    }
  }

  onMakeComment() {
    const tim = firebase.firestore.FieldValue.serverTimestamp();
    let newComm = new Comment(this.commentBoxText, this.posterName, this.postId, tim);
    this.comments.push(newComm);
    let makeComm = this.postServ.makeComment(this.courseId, this.postId,
      this.commentBoxText, this.posterId, this.posterName, tim); // write new comment
    makeComm.then((doc) => {
      console.log({doc});
      this.commentBoxText = "";
    }).catch((err) => {
      console.log(err);
      this.commentBoxText = "";
    })
  }

}
