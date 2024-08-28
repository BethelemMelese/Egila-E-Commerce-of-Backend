const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      required: [true, "please insert payment method"],
    },
    paymentSlip: {
      type: String,
      required: [true, "please insert payment slip"],
    },
    paymentStatus: {
      type: String,
      required: [true, "please insert payment status"],
    },
    orderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false,
      },
    ],
    customerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
