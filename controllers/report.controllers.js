const Item = require("../models/item.model.js");
const ItemCategory = require("../models/itemCategory.model.js");

const getItemName = async (req, res) => {
  try {
    const item = await Item.find();
    const response = item.map((value) => {
      return {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemCategory = async (req, res) => {
  try {
    const category = await ItemCategory.find();
    const response = category.map((value) => {
      return {
        id: value._id,
        categoryName: value.categoryName,
        categoryDescription: value.categoryDescription,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getItemName, getItemCategory };
