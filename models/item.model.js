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
    quantity: {
      type: Number,
      required: true,
    },
    // for Many to Many relationship the attribute has to be defined on both models just like in Item,
    // In the user also has object list of items.
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
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
