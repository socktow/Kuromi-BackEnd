const express = require('express');
const router = express.Router();
const User = require('../../Schema/UsersSchema');
const jwt = require('jsonwebtoken');
const sendMail = require('../../helper/sendmail');
const crypto = require('crypto');

router.post("/", async (req, res) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: "An account with this email already exists.",
      });
    }
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: req.body.cartData,
      isAdmin: false,
      emailVerificationToken: emailVerificationToken,
    });
    await newUser.save();
    const verificationLink = `http://localhost:3000/email-verify?token=${emailVerificationToken}`;
    await sendMail(req.body.username, req.body.email, req.body.password, verificationLink);
    console.log("Email sent successfully!");
    const tokenData = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(tokenData, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

module.exports = router;
