import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";

import firebase from "firebase";
import {NgForm} from "@angular/forms";
import {PostingService} from "../../../services/posting";

@IonicPage()
@Component({
  selector: 'page-addfile',
  templateUrl: 'addfile.html',
})
export class AddfilePage {

  fileName: string;
  fileDescription: string;
  fileCategory: string = "study";
  image: string;
  username: string;

  courseId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private actionSheetCtrl: ActionSheetController, private camera: Camera,
              private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              private postServ: PostingService) {
    let data = this.navParams.data;
    this.courseId = data.courseId;
    this.username = data.username;
  }

  onAddFile() {
    // adds new file to the class
    let addQuery = this.postServ.addFile(this.courseId, this.fileName, this.fileDescription, this.fileCategory, this.username);
    addQuery.then(async (doc) => {
      console.log(doc);

      if (this.image) {
        await this.uploadImage(doc.id);
      }

      this.image = undefined;

      this.toastCtrl.create({
        message: "Your post has been created successfully",
        duration: 3000
      }).present();
      this.navCtrl.pop();
    }).catch((err) => {
      this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).present();
    })
  }

  chooseFile() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Choose file source',
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
            url: url
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
