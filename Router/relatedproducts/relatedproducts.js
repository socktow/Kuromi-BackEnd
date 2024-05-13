const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema');

router.get("/relatedproducts", async (req, res) => {
  try {
    const randomWomenProducts = await Product.aggregate([
      { $match: { category: "women" } },
      { $sample: { size: 2 } }
    ]);

    const randomMenProducts = await Product.aggregate([
      { $match: { category: "men" } },
      { $sample: { size: 1 } }
    ]);

    const randomKidProducts = await Product.aggregate([
      { $match: { category: "kid" } },
      { $sample: { size: 1 } }
    ]);

    const relatedProducts = [...randomWomenProducts, ...randomMenProducts, ...randomKidProducts];
    relatedProducts.sort(() => Math.random() - 0.5);
    const selectedProducts = relatedProducts.slice(0, 4);

    res.json(selectedProducts);
  } catch (error) {
    console.error("Error retrieving related products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
