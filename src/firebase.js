import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDRmfAXw40TS_jcNH7VFzhU3hz_FCjDoqA",
  authDomain: "orders-test-app.firebaseapp.com",
  databaseURL: "https://orders-test-app.firebaseio.com",
  projectId: "orders-test-app",
  storageBucket: "orders-test-app.appspot.com",
  messagingSenderId: "90956473363"
};

export const firebaseApp = firebase.initializeApp(config);
export const ordersRef = firebase.database().ref('orders');
export const userListRef = firebase.database().ref('userList');
