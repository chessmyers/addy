import firebase, {User} from "firebase";

export class PostingService {

  public infiniteEvent: any;
  schoolID: string = "usc";
  term: string = "spring2019";

  setSchoolID(id:string) {
    this.schoolID = id;
  }

  seterm(term:string) {
    this.term = term;
  }

  getSchoolID() {
    return this.schoolID;
  }

  getTerm() {
    return this.term;
  }

  getUser(): User {
    return firebase.auth().currentUser;
  }

  getComments(courseId: any, postId: any) {
    let query = firebase.firestore().collection("schools").doc(this.schoolID)
      .collection("posts").doc(postId).collection("comments").orderBy('time');
    return query.get();
  }

  makeComment(courseId: any, postId: any, text: string, posterId: any, posterName: string, time: any) {
    let query =  firebase.firestore().collection("schools").doc(this.schoolID)
      .collection("posts").doc(postId).collection("comments");
    return query.add({
      text: text,
      posterId: posterId,
      posterName: posterName,
      time: time
    })
  }

  makePost(courseId: any, postTitle: string, postContent: string, posterName: string) {
    let postQuery = firebase.firestore().collection("schools").doc(this.schoolID).collection("posts");
      return postQuery.add({
        title: postTitle,
        content: postContent,
        classFor: courseId,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        poster: firebase.auth().currentUser.uid,
        poster_name: posterName
      })
  }

  loadClassPosts(courseID: any, pageSize:number) { // load
    return firebase.firestore().collection("schools").doc(this.schoolID).collection("posts")
      .where("classFor", "==", courseID).orderBy("created", "desc").limit(pageSize).get();
  }

  loadMoreClassPosts(courseID: any, cursor: any, pageSize: number) {
    return firebase.firestore().collection("schools").doc(this.schoolID)
      .collection("posts").where("classFor", "==", courseID)
      .orderBy("created", "desc").startAfter(cursor).limit(pageSize).get();
  }

  addFile(courseId: any, fileName: string, fileDescription: string, fileCategory: string, userName: string) {
    let addQuery = firebase.firestore().collection("schools").doc(this.schoolID).collection(this.term)
      .doc(courseId).collection("files");
      return addQuery.add({
      name: fileName,
      description: fileDescription,
      category: fileCategory,
      //url:
      created: firebase.firestore.FieldValue.serverTimestamp(),
      poster: firebase.auth().currentUser.uid,
      poster_name: userName
    })
  }

  loadFiles(courseID: any) {
    return firebase.firestore().collection("schools").doc(this.schoolID)
      .collection(this.term).doc(courseID).collection("files").orderBy("name").get();
  }


  loadStudents(courseID: any) {
    return firebase.firestore().collection("students")
      .where("classes", "array-contains", courseID).where("school", "==", this.schoolID).get();
  }

  getClasses() {
    return firebase.firestore().collection("schools").doc(this.schoolID).
    collection(this.term).orderBy("subjectAbbvr", "desc").get();
  }

  getClass(clasID: string) {
    return firebase.firestore().collection("schools").doc(this.schoolID).collection(this.term).doc(clasID);
  }

   getStudent(UID: string){
    return firebase.firestore().collection("students").doc(UID);
  }

  getMyClasses() { // returns list of my classes
    return firebase.firestore().collection("students").doc(firebase.auth().currentUser.uid).get();
  }

  myClassQuery() { // query for all classes
    return firebase.firestore().collection("schools").doc(this.schoolID).collection(this.term);
  }

  removeStudentFromClass(clasID: string, user: User) {
    return firebase.firestore().collection("schools").doc(this.schoolID).collection(this.term).doc(clasID).update({
      students: firebase.firestore.FieldValue.arrayRemove(user.uid)
    })
  }

  removeClassFromStudent(clasID: string, user: User) {
    return firebase.firestore().collection("students").doc(user.uid).update({
      classes: firebase.firestore.FieldValue.arrayRemove(clasID)
    })
  }

}
