const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "please insert address"],
    },
    subCity: {
      type: String,
      required: [true, "please insert sub city"],
    },
    town: {
      type: String,
      required: false,
    },
    userId: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
