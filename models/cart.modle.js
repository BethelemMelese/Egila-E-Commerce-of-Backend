const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    addedDate: {
      type: Date,
      required: true,
    },
    itemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
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

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
