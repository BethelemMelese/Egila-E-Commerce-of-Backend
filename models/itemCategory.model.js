const mongoose = require("mongoose");

const ItemCategorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "please insert Category Name"],
      unique: true,
    },
    categoryDescription: {
      type: String,
      required: false,
    },
    categoryImage: {
      type: String,
      required: [true, "please insert image path"],
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
