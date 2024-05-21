const express = require('express');
const router = express.Router();
const OrderData = require('../../Schema/OrderDataSchema');
const sendOrderConfirmationEmail = require('../../helper/sendOrderConfirmationEmail');

router.get('/', async (req, res) => {
  try {
    const orders = await OrderData.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const order = await OrderData.findOne({ orderNumber: parseInt(orderNumber, 10) });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const lastOrder = await OrderData.aggregate([
      { $sort: { orderNumber: -1 } },
      { $limit: 1 },
    ]);

    let nextOrderNumber = 1;

    if (lastOrder.length > 0) {
      nextOrderNumber = lastOrder[0].orderNumber + 1;
    }

    const {
      userId,
      receiverName,
      deliveryAddress,
      phoneNumber,
      email,
      note,
      orderedProducts,
      PaymentMethodChangeEvent,
      totalBill,
      status,
    } = req.body;

    const newOrder = new OrderData({
      userId,
      orderNumber: nextOrderNumber,
      receiverName,
      deliveryAddress,
      phoneNumber,
      email,
      note,
      PaymentMethodChangeEvent,
      orderedProducts,
      totalBill,
      status,
    });
    const savedOrder = await newOrder.save();
    // await sendOrderConfirmationEmail(savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status, message } = req.body;

  try {
    let updateFields = { status };
    if (message) {
      updateFields.$push = { logs: { message } };
    }

    const updatedOrder = await OrderData.findByIdAndUpdate(
      orderId,
      updateFields,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
