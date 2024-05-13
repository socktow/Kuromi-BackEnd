const express = require('express');
const router = express.Router();
const User = require('../../Schema/UsersSchema'); 
const jwt = require('jsonwebtoken');
const sendMail = require('../../helper/sendmail');

router.post("/", async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "existing user found with same email",
      });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    await user.save();
    await sendMail(req.body.username, req.body.email, req.body.password);
    console.log("Email sent successfully!");
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, "secret_ecom");

    // Trả về kết quả
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

module.exports = router;
