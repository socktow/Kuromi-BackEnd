const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  voucherName: {
    type: String,
    required: true
  },
  voucherCode: {
    type: String,
    required: true,
    unique: true
  },
  minimumOrderValue: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  maximumDiscount: {
    type: Number,
    required: true
  },
  voucherExpiry: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    required: true
  }
});

const Voucher = mongoose.model('Voucher', VoucherSchema);

module.exports = Voucher;
