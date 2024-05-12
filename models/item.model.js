const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "please insert Item Name"],
      unique: true,
    },
    itemDescription: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: [true, "please insert Brand Name"],
    },
    image: {
      type: String,
      required: [true, "please insert image path"],
    },
    cartIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: false,
      },
    ],
    orderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false,
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemCategory",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
