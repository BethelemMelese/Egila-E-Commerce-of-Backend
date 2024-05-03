const mongoose = require("mongoose");

const ItemCategorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "please enter Category Name"],
    },

    categoryDescription: {
      type: String,
      required: [true, "please enter Category Description"],
    },
  },
  {
    timestamps: true,
  }
);

const ItemCategory = mongoose.model("ItemCategory", ItemCategorySchema);
module.exports = ItemCategory;
