const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema');

router.get("/", async (req, res) => {
  try {
    const popularWomenProducts = await Product.find({ category: "women" }).sort({ popularity: -1 }).limit(4);
    res.json(popularWomenProducts);
  } catch (error) {
    console.error("Error fetching popular women products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
