const express = require('express');
const router = express.Router();
const Voucher = require('../../Schema/VoucherSchema');

router.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vouchers', error });
  }
});
router.post('/vouchers', async (req, res) => {
  const { voucherName, voucherCode, minimumOrderValue, discountPercentage, maximumDiscount, voucherExpiry, usageLimit } = req.body;
  if (!voucherName || !voucherCode || !minimumOrderValue || !discountPercentage || !maximumDiscount || !voucherExpiry || !usageLimit) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newVoucher = new Voucher({
      voucherName,
      voucherCode,
      minimumOrderValue,
      discountPercentage,
      maximumDiscount,
      voucherExpiry,
      usageLimit
    });

    await newVoucher.save();
    res.status(201).json({ message: 'Voucher created successfully', voucher: newVoucher });
  } catch (error) {
    res.status(500).json({ message: 'Error creating voucher', error });
  }
});

module.exports = router;
