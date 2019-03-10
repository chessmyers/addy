import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, LoadingController} from 'ionic-angular';
import {AddfilePage} from "../addfile/addfile";
import {AddpostPage} from "../addpost/addpost";
import {PostviewPage} from "../postview/postview";
import {FileviewPage} from "../fileview/fileview";
import {CommentsviewPage} from "../commentsview/commentsview";

import {Post} from "../../../models/post";
import {Upload} from "../../../models/upload";
import {Clas} from "../../../models/clas";

import moment from "moment";
import {PostingService} from "../../../services/posting";


@IonicPage()
@Component({
  selector: 'page-classview',
  templateUrl: 'classview.html',
})
export class ClassviewPage {

  classPages: any;

  courseFullName: string;
  courseNumIdentifier: string;
  professor: string;
  subject: string;
  courseAbbvr: string;
  courseType: string;
  courseUnits: string;
  studentsList: any = [];
  courseId: string;

  postView: any = PostviewPage;
  fileView: any = FileviewPage;
  commentsView: any = CommentsviewPage;

  term: string;

  filesLoaded = false; // have files been loaded yet?
  studentsLoaded = false; // have students been loaded yet?

  pageSize: number = 5;
  cursor: any;
  infiniteEvent: any;

  posts: Post[];
  sgList: Upload[] = [];
  hwList: Upload[] = [];
  quizList: Upload[] = [];
  testList: Upload[] = [];
  syllList: Upload[] = [];
  otherFileList: Upload[] = [];

  username: string;
  userID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private loadingCtrl: LoadingController, private postServ: PostingService) {
    this.classPages = 'posts';
    let data: Clas = this.navParams.data;
    this.courseFullName = data.fullName;
    this.courseNumIdentifier = data.identifier;
    this.professor = data.professor;
    this.subject = data.subject;
    this.courseAbbvr = data.abbvr;
    this.courseType = data.type;
    this.courseUnits = data.units;
    this.studentsList = data.students;
    this.courseId = data.id;

    this.userID = this.postServ.getUser().uid;

    this.postServ.getStudent(this.userID).get()
      .then((doc) => {
        this.username = doc.data().username;
      }).catch((err) => {
      console.log(err.message);
    });

    this.loadPosts();
  }


  addFileModal() {
    const addFiles = this.modalCtrl.create(AddfilePage, {
      courseId: this.courseId,
      username: this.username
    });
    addFiles.onDidDismiss(() => {
      this.filesLoaded = false;
      this.loadFiles();
    });
    addFiles.present();
  }

  addPostModal() {
    const addPost = this.modalCtrl.create(AddpostPage,
      {
        courseName: this.courseFullName,
        courseId: this.courseId,
        username: this.username
      });
    addPost.onDidDismiss(() => {
      this.loadPosts();
    });
    addPost.present();
  }

  openPost(post: Post) {
    this.navCtrl.push(this.postView, [post, this.courseId]);
  }

  openFile(file: Upload) {
    this.navCtrl.push(this.fileView, file);
  }

  openComments(post: Post) {
    this.navCtrl.push(this.commentsView, post);
  }

  loadPosts() {
    this.posts = [];

    let loading = this.loadingCtrl.create({
      content: "Loading posts..."
    });
    loading.present();

    let query = this.postServ.loadClassPosts(this.courseId, this.pageSize);

    query.then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(new Post(doc.data().title, doc.data().content, doc.data().classFor, doc.data().poster,
            doc.data().poster_name, doc.data().created, doc.data().image, doc.id));
          this.cursor = doc;
        });
        loading.dismiss();
        //this.cursor = docs[this.posts.length - 1];
      }).catch((err) => {
      console.log(err);
    });
    console.log(this.posts);
  }

  loadMorePosts(event) {

    let query = this.postServ.loadMoreClassPosts(this.courseId, this.cursor, this.pageSize);

    query.then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(new Post(doc.data().title, doc.data().content, doc.data().classFor,
            doc.data().poster, doc.data().poster_name, doc.data().created, doc.data().image, doc.id));
          this.cursor = doc;
        });
        if (docs.size < this.pageSize) {
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          //this.cursor = docs[this.posts.length - 1];
        }
      }).catch((err) => {
      console.log(err);
    })
  }

  refresh(event) {
    this.loadPosts();
    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }
    event.complete();
  }

  refreshStudents(event) {
    this.studentsLoaded = false;
    this.loadStudents();
    event.complete();
  }

  refreshFiles(event) {
    this.filesLoaded = false;
    this.loadFiles();
    event.complete();
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  loadStudents() {
    if (this.studentsLoaded == false) {
      this.studentsList = [];
      let loading = this.loadingCtrl.create({
        content: "Loading class members...",
      });
      loading.present();

      let query = this.postServ.loadStudents(this.courseId);

      query.then((students) => {
        students.forEach((student) => {
          console.log(student.data());
          this.studentsList.push(student.data().username);
        });
        this.studentsLoaded = true;
      }).catch((err) => {
        console.log(err);
      });


      loading.dismiss();
    }
  }

  loadFiles() {
    if (this.filesLoaded == false) {
      this.sgList = [];
      this.quizList = [];
      this.testList = [];
      this.syllList = [];
      this.otherFileList = [];
      let loading = this.loadingCtrl.create({
        content: "Loading files...",
      });
      loading.present();
      //name: string, description: string, category: string, url: string
      let query = this.postServ.loadFiles(this.courseId);

        query.then((docs) => {
          docs.forEach((doc) => {
            let file = new Upload(doc.data().name, doc.data().description, doc.data().category, doc.data().url,
              doc.data().poster, doc.data().poster_name, doc.data().created);
            switch (doc.data().category) {
              case "study":
                this.sgList.push(file);
                break;
              case "homework":
                this.hwList.push(file);
                break;
              case "quiz":
                this.quizList.push(file);
                break;
              case "test":
                this.testList.push(file);
                break;
              case "syllabus":
                this.syllList.push(file);
                break;
              case "other":
              default:
                this.otherFileList.push(file);
                break;
            }
          });
          this.filesLoaded = true;
        }).catch((err) => {
        console.log(err);
      });
      loading.dismiss();
    }
  }

  loadChat() {

  }

}
