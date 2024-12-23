const RazorPay = require("razorpay");
const Order = require("../models/order");

// Initiate Razorpay Payment
exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new RazorPay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRECT,
    });
    const amount = 5000;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      console.log(order);
      if (err) {
        console.log(err);
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};

// Verify Payment and Update Transaction Status
exports.updateTransactionStatus = async (req, res) => {
  try {
    console.log(payment_id);
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ isPremiumMember: true });
    await Promise.all([promise1, promise2]);
    return res
      .status(202)
      .json({ sucess: true, message: "Transaction Sucessful" });
  } catch (err) {
    res.status(403).json({ success: false });
    console.log(err);
  }
}