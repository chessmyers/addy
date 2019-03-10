import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Post} from "../../../models/post";
import firebase from "firebase";
import { Comment } from "../../../models/comment";
import { PostingService } from "../../../services/posting";
import moment from "moment";

@IonicPage()
@Component({
  selector: 'page-commentsview',
  templateUrl: 'commentsview.html',
})
export class CommentsviewPage {

  post: Post;
  comments: Comment[] = [];
  commentBoxText: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private postServ: PostingService) {
    this.post = this.navParams.data;
    let query = this.postServ.getComments(this.post.classFor, this.post.id);
    query.then((comments) => {
      comments.forEach((comment) => {
        let tempcomm = new Comment(comment.data().text, comment.data().posterName,
          comment.data().posterId, comment.data().time);
        this.comments.push(tempcomm);
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  onMakeComment() {
    const tim = firebase.firestore.FieldValue.serverTimestamp();
    let newComm = new Comment(this.commentBoxText, this.post.poster_name, this.post.poster, tim);
    this.comments.push(newComm);
    let makeComm = this.postServ.makeComment(this.post.classFor, this.post.id,
      this.commentBoxText, this.post.poster, this.post.poster_name, tim);
    makeComm.then((doc) => {
      console.log({doc});
    }).catch((err) => {
      console.log(err);
    });
    this.commentBoxText = "";
  }

  formatCreatedDate(time, type: number) {
    if (type == 1) { // top of post
      return moment(time).format('MMMM Do YYYY, h:mm:ss a');
    } else if (type == 2) { // inside comments
      let difference = moment(time).diff(moment());
      return moment.duration(difference).humanize();
    }
  }


}
