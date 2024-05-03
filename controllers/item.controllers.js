const Item = require("../models/item.model.js");

const getItems = async (req, res) => {
  try {
    const item = await Item.find({});
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const item = await Item.findById(categoryId);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, req.body);

    if (!item) {
      return res.status(404).json({ message: "Item not Found !" });
    }

    const updatedItem = await item.findById(id);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Item not Found !" });
    }

    res.status(200).json({ message: "Item is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItem,
  getItemByCategoryId,
  createItem,
  updateItem,
  deleteItem,
};
