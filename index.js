const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config(); // Đọc các biến môi trường từ .env

// Lấy các giá trị từ biến môi trường
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";
const port = process.env.PORT || 4000;

// Router 
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
const userIpRouter = require('./Router/UserIp/userIpRouter');

// Kết nối MongoDB
mongoose
.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Sử dụng Router 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
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
app.use('/api', userIpRouter);

// Cấu hình multer cho upload file
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
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    message: "File uploaded successfully",
  });
});

// Khởi động server
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
