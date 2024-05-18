const express = require('express');
const router = express.Router();
const Voucher = require('../../Schema/VoucherSchema');

// GET route to retrieve all vouchers
router.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vouchers', error });
  }
});

// POST route to create a new voucher
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

// DELETE route to delete a voucher by ID
router.delete('/vouchers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Voucher.findByIdAndDelete(id);
    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting voucher', error });
  }
});

module.exports = router;
