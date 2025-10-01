const Razorpay = require("razorpay");
const productModel = require("../models/product.model");
const paymentModel = require("../models/payment.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create order
async function createOrder(req, res) {
  const product = await productModel.findOne();

  const options = {
    amount: product.price.amount,
    currency: product.price.currency,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);

    // Save order in DB
    await paymentModel.create({
      orderId: order.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      status: "PENDING",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).send("Error creating order");
  }
}

// ✅ Verify payment
async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("razorpay/dist/utils/razorpay-utils.js");

    const result = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      secret
    );

    if (result) {
      const payment = await paymentModel.findOne({
        orderId: razorpay_order_id,
      });
      if (payment) {
        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;
        payment.status = "COMPLETED";
        await payment.save();
      }
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("Error verifying payment");
  }
}

module.exports = { createOrder, verifyPayment };
