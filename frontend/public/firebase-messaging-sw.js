importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyBMRsDxJl7gvLjipqiPrQshuRDB2TT7BFE",
    authDomain: "test1-pushnotification.firebaseapp.com",
    projectId: "test1-pushnotification",
    storageBucket: "test1-pushnotification.firebasestorage.app",
    messagingSenderId: "84918634447",
    appId: "1:84918634447:web:c8d453ad064b59aed6b4ba",
    measurementId: "G-124V54948W"
  };


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});