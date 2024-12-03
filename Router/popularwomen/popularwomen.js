const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema');

router.get("/", async (req, res) => {
  try {
    const popularWomenProducts = await Product.find({ category: "women" }).sort({ popularity: -1 }).limit(4);

    // Thay đổi URL của hình ảnh
    const updatedPopularWomenProducts = popularWomenProducts.map(product => ({
      ...product._doc,
      image: product.image.replace("http://localhost:4000", "https://kiemhieptinhduyen.one"),
    }));

    res.json(updatedPopularWomenProducts);
  } catch (error) {
    console.error("Error fetching popular women products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
