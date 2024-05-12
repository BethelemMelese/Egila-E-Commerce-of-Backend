const Item = require("../models/item.model.js");
const ItemCategory = require("../models/itemCategory.model.js");

const getItemCategorys = async (req, res) => {
  try {
    const itemCategory = await ItemCategory.find().populate("itemIds");
    res.status(200).json(itemCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const itemCategory = await ItemCategory.findById(id).populate("itemIds");

    res.status(200).json({
      id: itemCategory._id,
      categoryName: itemCategory.categoryName,
      categoryDescription: itemCategory.categoryDescription,
      itemIds: itemCategory.itemIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItemCategory = async (req, res) => {
  try {
    const itemCategory = await ItemCategory.create(req.body);

    res.status(200).json({
      id: itemCategory._id,
      categoryName: itemCategory.categoryName,
      categoryDescription: itemCategory.categoryDescription,
      itemIds: itemCategory.itemIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const itemCategory = await ItemCategory.findByIdAndUpdate(id, req.body);

    if (!itemCategory) {
      return res.status(404).json({ message: "Item Category not Found !" });
    }

    const updatedItemCategory = await ItemCategory.findById(id);
    res.status(200).json({
      id: updatedItemCategory._id,
      categoryName: updatedItemCategory.categoryName,
      categoryDescription: updatedItemCategory.categoryDescription,
      itemIds: updatedItemCategory.itemIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const itemCategory = await ItemCategory.findByIdAndDelete(id);

    if (!itemCategory) {
      return res.status(404).json({ message: "Item Category not Found !" });
    }

    res.status(200).json({ message: "Item Category is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItemCategorys,
  getItemCategory,
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
};
