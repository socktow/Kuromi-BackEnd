const mongoose = require('mongoose');

const orderDataSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    required: true,
    unique: true
  },
  receiverName: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  note: String,
  orderedProducts: [
    {
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    }
  ],
  totalBill: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'delivered' , 'shipped' , 'cancelled'], 
    default: 'pending'
  },
  PaymentMethodChangeEvent: {
    type: String,
    enum: ['Thanh Toán Online', 'Thanh Toán Nhận Hàng'],
    default: 'Thanh Toán Nhận Hàng'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  logs: [
    {
      timestamp: {
        type: Date,
        default: Date.now
      },
      message: String
    }
  ]
});

module.exports = mongoose.model('OrderData', orderDataSchema);
