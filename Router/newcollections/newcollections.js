const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema');

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    console.error("Error fetching new collections:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
