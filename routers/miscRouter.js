const express = require('express');
const router = express.Router();
const Product = require('../Schema/ProductSchema');

// Get new collections
router.get("/newCollections", async (req, res) => {
    let products = await Product.find();
  let newcollection = products.slice(1).slice(-8);
  console.log(newcollection);
  res.send(newcollection);
});

// Get popular women products
router.get("/popularWomen", async (req, res) => {
    let products = await Product.find({ category: "women" });
  let popularwomen = products.slice(1).slice(0,4);
  console.log(popularwomen);
  res.send(popularwomen);
});

// Get related products
router.get("/relatedProducts", async (req, res) => {
    try {
        let womenProducts = await Product.find({ category: "women" });
        let menProducts = await Product.find({ category: "men" });
        let kidProducts = await Product.find({ category: "kid" });
        let allProducts = [...womenProducts, ...menProducts, ...kidProducts];
        let randomProducts = [];
        while (randomProducts.length < 4) {
          let randomIndex = Math.floor(Math.random() * allProducts.length);
          randomProducts.push(allProducts[randomIndex]);
          allProducts.splice(randomIndex, 1);
        }
    
        res.json(randomProducts);
      } catch (error) {
        console.error("Error retrieving related products:", error);
        res.status(500).json({ error: "Server error" });
      }
});

module.exports = router;
