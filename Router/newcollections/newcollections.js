const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema');

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 }).limit(8);

    // Thay đổi URL của hình ảnh
    const updatedProducts = products.map(product => ({
      ...product._doc,
      image: product.image.replace("http://localhost:4000", "https://kiemhieptinhduyen.one"),
    }));

    res.json(updatedProducts);
  } catch (error) {
    console.error("Error fetching new collections:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
