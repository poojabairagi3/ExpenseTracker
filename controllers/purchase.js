const RazorPay = require('razorpay');
const Order = require('../models/order');

exports.purchasepremium = async (req, res) => {
    try {
        var rzp = new RazorPay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRECT
        })
        const amount = 5000;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            console.log(order);
            if (err) {
                console.log(err)
            }
            req.user.createOrder({ orderid: order.id, status: "PENDING" })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch(err => console.log(err));
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err })
    }
}

exports.updatetransactionstatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } })
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' },);
        const promise2 = req.user.update({ ispremiummember: true });
        await Promise.all([promise1, promise2])
        return res.status(202).json({ sucess: true, message: 'Transaction Sucessful' });
    }
    catch (err) {
        res.status(403).json({ success: false });
        console.log(err);
    }
}

