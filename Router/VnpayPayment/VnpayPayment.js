const express = require("express");
const router = express.Router();
const moment = require("moment");
const config = require("../../config.json");
const crypto = require("crypto");

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/payment', function (req, res, next) {
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress 

    const tmnCode = config.vnPayConfig.vnp_TmnCode;
    const secretKey = config.vnPayConfig.vnp_HashSecret;
    const vnpUrl = config.vnPayConfig.vnp_Url;
    const returnUrl = config.vnPayConfig.vnp_ReturnUrl;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss');
    const amount = 50000 * 100; // Số tiền cần nhân với 100
    const orderInfo = req.body.orderDescription;
    const orderType = req.body.orderType;
    let locale = req.body.language;
    if (!locale || locale === '') {
        locale = 'vn';
    }
    const currCode = 'VND';

    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
    };

    // Sắp xếp tham số theo thứ tự tăng dần của tên tham số
    const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = vnp_Params[key];
            return acc;
        }, {});

    // Tạo dữ liệu ký tự để tạo checksum bằng phương pháp SHA512
    const signData = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(signData, 'utf-8').digest('hex');

    vnp_Params['vnp_SecureHashType'] = 'SHA512';
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const queryParams = Object.entries(vnp_Params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    const redirectUrl = `${vnpUrl}?${queryParams}`;
    res.redirect(redirectUrl);
    console.log(redirectUrl);
});

module.exports = router;
