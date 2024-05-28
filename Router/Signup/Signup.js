const express = require('express');
const router = express.Router();
const User = require('../../Schema/UsersSchema');
const jwt = require('jsonwebtoken');
const sendMail = require('../../helper/sendmail');
const crypto = require('crypto');

router.post("/", async (req, res) => {
  try {
    // Kiểm tra xem có người dùng nào khác đã sử dụng email này chưa
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: "An account with this email already exists.",
      });
    }

    // Tạo một token xác minh email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Tạo một người dùng mới
    const newUser = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: req.body.cartData, // Sử dụng dữ liệu giỏ hàng từ yêu cầu
      isAdmin: false, // Chỉ đăng ký người dùng mới, không phải là admin
      emailVerificationToken: emailVerificationToken,
    });

    // Lưu người dùng mới vào cơ sở dữ liệu
    await newUser.save();

    // Gửi email xác nhận đăng ký
    const verificationLink = `http://localhost:3000/email-verify?token=${emailVerificationToken}`;
    await sendMail(req.body.username, req.body.email, verificationLink);
    console.log("Email sent successfully!");

    // Tạo mã token JWT cho người dùng mới
    const tokenData = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(tokenData, "secret_ecom");

    // Trả về kết quả thành công và mã token
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

module.exports = router;
