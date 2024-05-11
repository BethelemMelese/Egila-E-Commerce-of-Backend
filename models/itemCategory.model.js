const mongoose = require("mongoose");

const ItemCategorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "please enter Category Name"],
      unique: true,
    },
    categoryDescription: {
      type: String,
      required: [true, "please enter Category Description"],
    },
    itemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ItemCategory = mongoose.model("ItemCategory", ItemCategorySchema);
module.exports = ItemCategory;
