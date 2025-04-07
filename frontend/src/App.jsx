import { useState,useEffect } from 'react'
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";


import './App.css'
import Homepage from './Components/Homepage'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VendorDashboard from './Components/VendorDashboard';

function App() {


  async function requestPermission() {
    // this is a built in function which request the user to allow the permission to send him the notfications...through web app
    // and if he allows then we will generate the token for the user  (to uniquely identify the user )
    const permission = await Notification.requestPermission();
    if (permission === "granted") {  // if permission granted then generate token
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BIXBA6miQltKmoc1kGPsb3Fr3kpfxrbVd3mqc8TpXt7N2L8qZjK9Yle4IpmqxLLUWqPts49Q7GaubQyxQh8NqqU",
         
      });
      console.log("Token Gen", token);
       //send this token to mongodb
      // Send this token  to server ( db)
    } else if (permission === "denied") {  // if permission denied then give alert that u being denied 
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/vendordashboard/:vendorId" element={<VendorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
