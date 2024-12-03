const express = require('express');
const router = express.Router();
const Product = require('../../Schema/ProductSchema'); // Import model Product

// Add Product
router.post("/addproduct", async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      available: req.body.available,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
    });

    await product.save();
    console.log("Product Added:", product);
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove Product
router.post("/removeproduct", async (req, res) => {
  try {
    const productId = req.body.id;
    const product = await Product.findOneAndDelete({ id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        name: req.body.name,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Product removed successfully",
        productid: productId,
        name: req.body.name,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/allproducts", async (req, res) => {
  const searchQuery = req.query.search;
  let products;

  try {
    if (searchQuery) {
      products = await Product.find({ 
        name: { $regex: searchQuery, $options: "i" } 
      });
    } else {
      products = await Product.find();
    }

    // Thay đổi URL của hình ảnh
    const updatedProducts = products.map(product => ({
      ...product._doc,
      image: product.image.replace("http://localhost:4000", "https://kiemhieptinhduyen.one"),
    }));

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/allproducts/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Thay đổi URL của hình ảnh
    const updatedProduct = {
      ...product._doc,
      image: product.image.replace("http://localhost:4000", "https://kiemhieptinhduyen.one"),
    };

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/allproducts/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Lấy sản phẩm hiện tại
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Nếu không gửi image, giữ nguyên URL hiện tại
    const updatedData = {
      ...req.body,
      image: req.body.image || product.image,
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      updatedData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
