const express = require('express');
const router = express.Router();
const User = require('../../Schema/UsersSchema');

router.get('/', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).send('Token is missing');
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).send('Invalid token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    // Phản hồi thành công
    res.send('Email verified successfully!');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
