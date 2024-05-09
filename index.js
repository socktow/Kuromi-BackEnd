const port = 4000;
const fs = require('fs');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const configData = fs.readFileSync('config.json');
const config = JSON.parse(configData);
const Product = require("./Schema/ProductSchema");
const User = require("./Schema/UsersSchema");
app.use(express.json());
app.use(cors());
const mongoURI = config.mongoURI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Image Store
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Upload endpoint
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
    message: "File uploaded successfully",
  });
});

// Add product endpoint
app.post("/addproduct", async (req, res) => {
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
      avilable: req.body.avilable,
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
app.post("/removeproduct", async (req, res) => {
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

// Get Product
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Product by ID
app.get("/allproducts/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Product by ID
app.put("/allproducts/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId }, 
      req.body, 
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route để lấy thông tin của toàn bộ người dùng
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Thêm người dùng mới
app.post("/users", async (req, res) => {
  try {
    const userData = req.body;
    if (!userData) {
      return res.status(400).json({ error: "Missing user data" });
    }
    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    if (!updatedData) {
      return res.status(400).json({ error: "Missing updated data" });
    }
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    Object.assign(existingUser, updatedData);
    const updatedUser = await existingUser.save();
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Xóa người dùng bằng ID
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, "secret_ecom");
      res.json({ success: true, authToken });
    } else {
      res.status(400).json({ success: false, errors: "Incorrect password" });
    }
  } else {
    res.json({ success: false, errors: "Invalid Email" });
  }
});

app.get("/newcollections", async (req, res) => {
  let products = await Product.find();
  let newcollection = products.slice(1).slice(-8);
  console.log(newcollection);
  res.send(newcollection);
});

app.get("/popularwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popularwomen = products.slice(1).slice(0,4);
  console.log(popularwomen);
  res.send(popularwomen);
});

app.get("/relatedproducts", async (req, res) => {
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

app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  )
  res.json({ message: "added to cart" });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "removed from cart" });
});

app.post('/getcart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  res.send(userData.cartData);
})

app.get("/profile", fetchUser, async (req, res) => {
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

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
