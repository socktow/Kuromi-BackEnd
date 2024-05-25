const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Add this line to import mongoose
const Comment = require('../../Schema/CommentSchema');
const Product = require('../../Schema/ProductSchema');
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
    let userData = await User.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    const items = req.body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items array" });
    }
    for (const item of items) {
      if (!item || typeof item.productId !== 'number' || typeof item.size !== 'string' || typeof item.quantity !== 'number') {
        return res.status(400).json({ error: "Invalid item data" });
      }
      let existingItemIndex = userData.cartData.findIndex(cartItem => cartItem.productId === item.productId && cartItem.size === item.size);
      if (existingItemIndex !== -1) {
        userData.cartData[existingItemIndex].quantity += item.quantity;
      } else {
        userData.cartData.push({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity
        });
      }
    }
    await userData.save();
    res.json({ message: "Items added to cart" });
    console.log("Items added to cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const { productId, size } = req.body;
    if (!productId || !size) {
      return res.status(400).json({ error: "Invalid product ID or size" });
    }

    const itemIndex = userData.cartData.findIndex(
      (item) => item.productId === productId && item.size === size
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (userData.cartData[itemIndex].quantity === 1) {
      userData.cartData.splice(itemIndex, 1);
    } else {
      userData.cartData[itemIndex].quantity -= 1;
    }
    await userData.save();
    res.json({ message: "Item removed from cart" });
    console.log("Item removed from cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getcart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(userData.cartData);
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

router.patch("/cartreset", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cartData = [];
    await user.save();
    res.json({ message: "Cart updated successfully" });
    console.log("Cart updated successfully");
  } catch (error) {
    console.error("Error updating cart:", error);
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

router.post('/addcomment', fetchUser, async (req, res) => {
  const { productId, comment, rating } = req.body;

  if (typeof productId !== 'number') {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newComment = new Comment({
      userId: req.user.id,
      userName: user.name,  
      productId: productId,
      comment,
      rating
    });

    await newComment.save();
    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/comments/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const comments = await Comment.find({ productId: productId });
    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
