import firebase from 'firebase/app';
import 'firebase/auth';
const config = {
	apiKey: 'AIzaSyDIUy68yINCZFBmVAtweXbXr6hwXemYDbQ',
	authDomain: 'book-4d8c9.firebaseapp.com',
	databaseURL: 'https://book-4d8c9.firebaseio.com',
	projectId: 'book-4d8c9',
	storageBucket: 'book-4d8c9.appspot.com',
	messagingSenderId: '19255125124'
};
firebase.initializeApp(config);

firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    return firebase.auth().signInWithPopup;
  });

export const provider = new firebase.auth.GoogleAuthProvider();

export default firebase;
