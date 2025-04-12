const express = require("express");
const  User = require("../models/userModel");
const admin = require('../firebaseAdmin')

exports.userfcmtokenController = async (req, res) => {
    const { fcmToken } = req.body;
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
  
    if (!fcmToken) {
      return res.status(400).json({ error: "Missing fcmToken" });
    }
  
    try {
      await User.findByIdAndUpdate(userId, { $addToSet: { fcmTokens: fcmToken } });
      res.sendStatus(200);
    } catch (err) {
      console.error("Error saving FCM token", err);
      res.status(500).json({ error: "Failed to save token" });
    }
  };
