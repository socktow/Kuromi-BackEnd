const express = require('express');
const router = express.Router();
const User = require('../../Schema/UsersSchema');
const bcrypt = require('bcrypt');
// Lấy tất cả người dùng
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Thêm người dùng mới
router.post("/", async (req, res) => {
  try {
    const userData = req.body;
    if (!userData) {
      return res.status(400).json({ error: "Missing user data" });
    }
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Cập nhật người dùng bằng ID
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    if (!updatedData) {
      return res.status(400).json({ error: "Missing updated data" });
    }
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (updatedData.password) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(updatedData.password, saltRounds);
    }

    Object.assign(existingUser, updatedData);
    const updatedUser = await existingUser.save();
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Xóa người dùng bằng ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
