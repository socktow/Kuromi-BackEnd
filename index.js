require('dotenv').config();
const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Environment Variables
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Định nghĩa Router
const orderDataRouter = require("./Router/Order/orderData");
const productRouter = require("./Router/Product/product");
const newCollectionsRouter = require("./Router/newcollections/newcollections");
const popularwomenRouter = require("./Router/popularwomen/popularwomen");
const relatedproductsRouter = require("./Router/relatedproducts/relatedproducts");
const userRouter = require("./Router/Users/Users");
const signupRouter = require("./Router/Signup/Signup");
const loginRouter = require("./Router/Login/Login");
const AuthRouter = require("./Router/Auth/Auth");
const momoPaymentRouter = require('./Router/MomoPayment/MomoPayment');
const ZalopaymentRouter = require('./Router/ZaloPayment/ZaloPayment');
const VoucherRouter = require('./Router/Voucher/Voucher');
const verifyEmailRouter = require('./Router/verify-email/verify-email');

// Cấu hình middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Sử dụng Router
app.use('/newcollections', newCollectionsRouter);
app.use('/popularwomen', popularwomenRouter);
app.get("/relatedproducts", relatedproductsRouter);
app.use('/orderData', orderDataRouter);
app.use('/product', productRouter);
app.use('/users', userRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/api', AuthRouter);
app.use('/api', VoucherRouter);
app.use('/momo', momoPaymentRouter);
app.use('/zalo', ZalopaymentRouter);
app.use('/verify-email', verifyEmailRouter);
app.use('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
})
// PUBLIC IMAGE 
// app.use(express.static(path.join(__dirname, 'public')));
// LOCAL IMAGE 
app.use("/images", express.static("upload/images"));
// Cấu hình multer
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
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
    message: "File uploaded successfully",
  });
});

// Khởi động server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));