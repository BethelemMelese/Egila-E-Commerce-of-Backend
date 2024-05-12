const Item = require("../models/item.model.js");
const ItemCategory = require("../models/itemCategory.model.js");

const getItems = async (req, res) => {
  try {
    const item = await Item.find();
    // const response = await item.map((value) => {
    //   const result = {
    //     // id: value._id,
    //     itemName: value.itemName,
    //     itemDescription: value.itemDescription,
    //     quantity: value.quantity,
    //     categoryId: value.categoryId._id,
    //     categoryName: value.categoryId.categoryName,
    //   };

    //   return result;
    // });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("categoryId");
    const result = {
      id: item._id,
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      quantity: item.quantity,
      categoryId: item.categoryId._id,
      categoryName: item.categoryId.categoryName,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const item = await Item.find({ categoryId: categoryId }).populate(
      "categoryId"
    );
    const response = await item.map((value) => {
      const result = {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        quantity: value.quantity,
        categoryId: value.categoryId._id,
        categoryName: value.categoryId.categoryName,
      };

      return result;
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const existItem = await Item.findOne({ itemName: req.body.itemName });
    if (existItem != null) {
      return res.status(500).json({
        message: "The Item is already exist, please insert new item.",
      });
    } else {
      const item = await Item.create({
        itemName: req.body.itemName,
        itemDescription: req.body.itemDescription,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId,
      });

      const itemCategory = await ItemCategory.findByIdAndUpdate(
        { _id: req.body.categoryId },
        { $push: { itemIds: [item._id] } }
      );

      res.status(200).json({
        id: item._id,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        categoryId: itemCategory._id,
        categoryName: itemCategory.categoryName,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const getItemValue = await Item.findById(id);
    if (!getItemValue) {
      return res.status(404).json({ message: "Item not Found !" });
    }

    if (getItemValue.categoryId == req.body.categoryId) {
      const item = await Item.findByIdAndUpdate(id, req.body);
      res.status(200).json({
        id: item._id,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      });
    } else {
      const item = await Item.findByIdAndUpdate(id, req.body);
      console.log("item..", item);
      const itemCategory = await ItemCategory.findByIdAndUpdate(
        { _id: req.body.categoryId },
        { $push: { itemIds: [id] } }
      );

      console.log("itemCategory..", itemCategory);

      const check = await ItemCategory.findByIdAndUpdate(
        { _id: getItemValue.categoryId },
        { itemIds: [id] },
        { $pull: { itemIds: [id] } }
      );

      console.log("check...", check);

      res.status(200).json({
        id: item._id,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        categoryId: itemCategory._id,
        categoryName: itemCategory.categoryName,
      });
    }
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

async function isExist(params) {
  await Item.findOne({ itemName: params.itemName }).then((itemName) => {
    if (itemName != null) {
      return true;
    } else {
      return false;
    }
  });
}

async function isNew(params) {
  await Item;
}

module.exports = {
  getItems,
  getItemById,
  getItemByCategoryId,
  createItem,
  updateItem,
  deleteItem,
};
