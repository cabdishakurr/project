import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';

const firebaseConfig = {
  apiKey: "AIzaSyBglvVR7jJMQyq43kUeL6BdiombunOOs14",
  authDomain: "ai-projects24-25.firebaseapp.com",
  projectId: "ai-projects24-25",
  storageBucket: "ai-projects24-25.appspot.com",
  messagingSenderId: "591181295546",
  appId: "1:591181295546:web:680aa8a888436737323783"
};

firebase.initializeApp(firebaseConfig);

Application.run({ moduleName: 'app-root' });