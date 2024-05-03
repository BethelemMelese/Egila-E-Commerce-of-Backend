const mongoose = require("mongoose");

const UserItemSchema = mongoose.Schema(
  {
    _itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },

    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const UserItem = mongoose.model("UserItem", UserItemSchema);
module.exports = UserItem;
