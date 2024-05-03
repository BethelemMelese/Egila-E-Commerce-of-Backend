const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "please enter Item Name"],
      unique: true,
    },

    itemDescription: {
      type: String,
      required: [true, "please enter Item Description"],
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemCategory",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
