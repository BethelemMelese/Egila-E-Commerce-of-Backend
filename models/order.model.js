const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    orderStatus: {
      type: String,
      required: [true, "please insert order status"],
    },
    shoppingAddress: {
      type: String,
      required: [true, "please insert shopping address"],
    },
    cartIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
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
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
