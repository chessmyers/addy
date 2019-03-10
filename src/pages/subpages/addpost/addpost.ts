import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';
import { NgForm } from "@angular/forms";

import { PostingService } from "../../../services/posting";
import firebase from 'firebase';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AuthService } from "../../../services/auth";
import {Post} from "../../../models/post";


@IonicPage()
@Component({
  selector: 'page-addpost',
  templateUrl: 'addpost.html',
})
export class AddpostPage {

  courseName: string;
  courseId: string;

  title: string;
  content: string;
  classFor: string;
  image: string;

  username: string;
  postMade: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private postServ: PostingService, private toastCtrl: ToastController,
              private camera: Camera, private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController) {
        let modalData = this.navParams.data;
        this.courseName = modalData.courseName;
        this.courseId = modalData.courseId;
        this.username = modalData.username;
  }

  onMakePost(form: NgForm) {
    if (!this.postMade) {
      this.postMade = true;
      let data = form.value;
      let postQuery = this.postServ.makePost(this.courseId, this.title, this.content, this.username);
      // adds new post to the collection
      postQuery.then(async (doc) => {
        console.log(doc);

        if (this.image) {
          await this.uploadImage(doc.id);
        }

        if (this.postServ.infiniteEvent) {
          this.postServ.infiniteEvent.enable(true);
        }

        this.image = undefined;

        let toast = this.toastCtrl.create({
          message: "Your post has been created successfully",
          duration: 3000
        }).present();
        this.navCtrl.pop();
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  addImage() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Choose image source',
      buttons: [
        {
          text: 'Take picture',
          handler: () => {
            this.launchCamera();
          }
        },
        {
          text: 'Choose from library',
          handler: () => {
            this.chooseImage();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Action sheet closed");
          }
        }
      ]
    });
    actionSheet.present();
  }

  launchCamera() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    };

    this.camera.getPicture(options).then((base64Image) => {
      console.log(base64Image);
      this.image = "data:image/png;base64" + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

  chooseImage() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true
    };

    this.camera.getPicture(options).then((base64Image) => {
      console.log(base64Image);
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

  uploadImage(name: string) {
    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      });

      loading.present();

      let ref = firebase.storage().ref("postImages/" + name);

      let uploadTask = ref.putString(this.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot);
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loading.setContent("Uploaded " + percentage + "% ...")
      }, (error) => {
        console.log(error)
      }, () => {
        console.log("Upload complete!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            loading.dismiss();
            resolve();
          }).catch((err) => {
            loading.dismiss();
            reject();
          })
        }).catch((err) => {
          reject();
        })
      })
    })
  }

}
