import firebase from 'firebase';

export class AuthService {

  username: String;
  university: String;

  signUp(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logOut() {
    return firebase.auth().signOut();
  }

  deleteAccount() {
    return firebase.auth().currentUser.delete();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  static getActiveUserID() {
    return firebase.auth().currentUser.uid;
  }

  getActiveUserData() {
    return firebase.firestore().collection("students").doc(firebase.auth().currentUser.uid);
  }

  getSameNameUser(userName) {
    return firebase.firestore().collection("students").where("username", "==", userName)
  }

  getUserName() {
    if (this.username === undefined) {
      firebase.firestore().collection("schools").doc("northeastern")
        .collection("students").doc(this.getActiveUser().uid).get()
        .then((doc) => {
          this.username = doc.data().username;
          console.log("Auth!" + this.username);
          return this.username;
        }).catch((err) => {
          console.log(err);
      })
    } else {
      return this.username;
    }
  }



  getSchool() {
    return this.university;
  }

  changeUserName(newName) {
    this.username = newName;
  }

  addNewUser(newUsername) {
    return firebase.firestore().collection("students").doc(firebase.auth().currentUser.uid).set({
      school: "usc", // TODO
      classes: [],
      username: newUsername
    })
  }

  checkEmail(email: string) {
    return email.includes("@usc.edu");
  }

}
