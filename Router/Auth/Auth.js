const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Schema/UsersSchema');

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("Invalid token.");
  }
};

router.post("/addtocart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ message: "added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
    }
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ message: "removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/getcart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    res.send(userData.cartData);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/profile", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.cartData) {
      user.cartData = req.body.cartData;
    }

    await user.save();
    res.json({ message: "User profile updated", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/profile", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;
    user.cartData = req.body.cartData || user.cartData;

    await user.save();
    res.json({ message: "User profile updated", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
