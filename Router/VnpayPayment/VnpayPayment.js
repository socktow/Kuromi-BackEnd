const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("qs"); 
const moment = require("moment"); 
const config = require("../../config.json");
const CryptoJS = require("crypto-js"); 

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
