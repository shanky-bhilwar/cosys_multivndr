import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBMRsDxJl7gvLjipqiPrQshuRDB2TT7BFE",
    authDomain: "test1-pushnotification.firebaseapp.com",
    projectId: "test1-pushnotification",
    storageBucket: "test1-pushnotification.firebasestorage.app",
    messagingSenderId: "84918634447",
    appId: "1:84918634447:web:c8d453ad064b59aed6b4ba",
    measurementId: "G-124V54948W"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const messaging = getMessaging(app);
// export const analytics = getAnalytics(app);