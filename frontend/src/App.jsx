// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { jwtDecode } from "jwt-decode";

import './App.css';
import Homepage from './Components/Homepage';
import VendorDashboard from './Components/VendorDashboard';
import Disputeorderpage from './pages/Disputeorderpage';
import Disputeformpage from './pages/Disputeformpage';
import VendorAllDisputesPage from './pages/VendorAllDisputesPage';
import UserDisputeStatus from './pages/UserDisputeStatus';
import VendorOrderManagement from './Components/VendorOrderManagement';

function App() {
  useEffect(() => {

    const token = localStorage.getItem("token");
      const decoded = token ? jwtDecode(token) : {};
      const userId = decoded?.id;
    // 1. Register service worker, request permission, get & send FCM token
    async function setupFCM() {
      if (!("serviceWorker" in navigator)) return;

      try {
        // Register the Firebase service worker for background notifications
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log("SW registered:", registration);

        // Firebase automatically handles background notifications, no need to call useServiceWorker()

        // this is a built-in function which requests the user to allow permission for notifications
        // if the user allows, we will generate the token for the user (to uniquely identify them)
        const permission = await Notification.requestPermission();
        if (permission === "granted") {  // if permission granted then generate token
          // Generate FCM token
          const token = await getToken(messaging, {
            vapidKey:
              "BIXBA6miQltKmoc1kGPsb3Fr3kpfxrbVd3mqc8TpXt7N2L8qZjK9Yle4IpmqxLLUWqPts49Q7GaubQyxQh8NqqU", // Replace with your VAPID key
          });
          console.log("Token Gen", token);

          // Send this token to your server (e.g., MongoDB or another backend)
          await fetch(`http://localhost:5000/api/user/save-fcm-token/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: "67f60c9155486c01fa21f521", // Replace with dynamic user ID
              fcmToken: token,
            }),
          });
        } else if (permission === "denied") {  // if permission denied, show alert
          alert("You denied notifications.");
        }
      } catch (err) {
        console.error("FCM setup error:", err);
      }
    }

    setupFCM();

    // 2. Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground push received:", payload);
      // Show an alert or update UI when a push notification is received
      alert(payload.notification.title + "\n" + payload.notification.body);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/vendordashboard/:vendorId" element={<VendorDashboard />} />
        <Route path="/dispute/:userId" element={<Disputeorderpage />} />
        <Route path="/disputeform/:userId/:vendorId/:productId/:orderId" element={<Disputeformpage />} />
        <Route path="/vendor/alldisputes/:vendorId" element={<VendorAllDisputesPage />} />
        <Route path="/user/disputesStatus/:userId" element={<UserDisputeStatus />} />
        <Route path="/vendor/Allorders/:vendorId" element={<VendorOrderManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
