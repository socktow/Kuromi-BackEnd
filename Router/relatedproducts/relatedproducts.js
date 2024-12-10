const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema');

router.get("/relatedproducts", async (req, res) => {
  try {
    const categories = [
      { category: "women", size: 2 },
      { category: "men", size: 1 },
      { category: "kid", size: 1 },
    ];
    const productPromises = categories.map(({ category, size }) =>
      Product.aggregate([
        { $match: { category } },
        { $sample: { size } },
      ])
    );
    const categoryResults = await Promise.all(productPromises);
    const relatedProducts = categoryResults.flat().sort(() => Math.random() - 0.5);
    const selectedProducts = relatedProducts.slice(0, 4);
    const updatedProducts = selectedProducts.map(product => ({
      ...product,
      image: product.image.replace("http://localhost:4000", "https://kiemhieptinhduyen.one"),
    }));

    res.json(updatedProducts);
  } catch (error) {
    console.error("Error retrieving related products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
