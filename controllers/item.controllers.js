const Item = require("../models/item.model.js");
const ItemCategory = require("../models/itemCategory.model.js");
const dotenv = require("dotenv");
const fs = require("fs");

// configuration file
dotenv.config();

const getItems = async (req, res) => {
  try {
    const search = req.query.search || "";

    const item = await Item.find({
      itemName: { $regex: search},
      brand: { $regex: search},
      itemDescription: { $regex: search},
    }).populate("categoryId");
    const response = item.map((value) => {
      return {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        quantity: value.quantity,
        price:  `${value.price} ETB` ,
        brand: value.brand,
        itemImage: value.itemImage,
        categoryId: value.categoryId._id,
        categoryName: value.categoryId.categoryName,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewArrivalItems = async (req, res) => {
  try {
    const search = req.query.search || "";
    let filteredItems;
    if (search) {
      filteredItems = await Item.find({
        itemName: { $regex: search},
        brand: { $regex: search},
        itemDescription: { $regex: search},
      })
        .sort({ createdAt: -1 })
        .limit(4);
    } else {
      filteredItems = await Item.find().sort({ createdAt: -1 }).limit(4);
    }
    const response = filteredItems.map((value) => {
      return {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        quantity: value.quantity,
        price: `${value.price} ETB` ,
        brand: value.brand,
        itemImage: value.itemImage,
        categoryId: value.categoryId._id,
        categoryName: value.categoryId.categoryName,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";

    const item = await Item.find({
      itemName: { $regex: search },
    }).populate("categoryId");
    const response = item.map((value) => {
      return {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        quantity: value.quantity,
        price:  `${value.price} ETB` ,
        brand: value.brand,
        itemImage: value.itemImage,
        categoryId: value.categoryId._id,
        categoryName: value.categoryId.categoryName,
      };
    });
    res.status(200).json(response);
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
        price:  `${value.price} ETB` ,
        brand: value.brand,
        itemImage: value.itemImage,
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

const filterItemByCategoryIdAndSearch = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const categoryId = req.query.id;
    let filteredItems;

    if (searchTerm != "") {
      filteredItems = await Item.find({
        itemName: { $regex: searchTerm},
        brand: { $regex: searchTerm},
        itemDescription: { $regex: searchTerm},
      })
        .sort({ createdAt: -1 })
        .limit(4);
    } else if (categoryId != "") {
      filteredItems = await Item.find({ categoryId: categoryId });
    } else {
      filteredItems = await Item.find().sort({ createdAt: -1 });
    }

    const response = await filteredItems.map((value) => {
      const result = {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        quantity: value.quantity,
        price:  `${value.price} ETB` ,
        brand: value.brand,
        itemImage: value.itemImage,
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
        message: "Item is already exist, please insert new item.",
      });
    } else {
      const formDate = {
        itemName: req.body.itemName,
        itemDescription: req.body.itemDescription,
        quantity: req.body.quantity,
        brand: req.body.brand,
        price: req.body.price,
        categoryId: req.body.categoryId,
        itemImage: req.file.filename,
      };

      const item = await Item.create(formDate);
      const itemCategory = await ItemCategory.findByIdAndUpdate(
        { _id: req.body.categoryId },
        { $push: { itemIds: [item._id] } }
      );

      res.status(200).json({
        id: item._id,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        brand: item.brand,
        price: item.price,
        itemImage: item.itemImage,
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
      if (getItemValue.itemImage == req.body.file) {
        const item = await Item.findByIdAndUpdate(id, req.body);
        res.status(200).json({
          id: item._id,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          quantity: item.quantity,
          brand: item.brand,
          price: item.price,
          itemImage: item.itemImage,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
        });
      } else {
        const item = await Item.findByIdAndUpdate(id, {
          itemName: req.body.itemName,
          itemDescription: req.body.itemDescription,
          quantity: req.body.quantity,
          brand: req.body.brand,
          price: req.body.price,
          categoryId: req.body.categoryId,
          itemImage: req.file.filename,
        });
        res.status(200).json({
          id: item._id,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          quantity: item.quantity,
          brand: item.brand,
          price: item.price,
          itemImage: item.itemImage,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
        });
      }
    } else {
      if (getItemValue.itemImage == req.body.file) {
        const item = await Item.findByIdAndUpdate(id, req.body);
        const itemCategory = await ItemCategory.findByIdAndUpdate(
          { _id: req.body.categoryId },
          { itemIds: [id] }
        );

        res.status(200).json({
          id: item._id,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          quantity: item.quantity,
          brand: item.brand,
          price: item.price,
          itemImage: item.itemImage,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
        });
      } else {
        const item = await Item.findByIdAndUpdate(id, {
          itemName: req.body.itemName,
          itemDescription: req.body.itemDescription,
          quantity: req.body.quantity,
          brand: req.body.brand,
          price: req.body.price,
          categoryId: req.body.categoryId,
          itemImage: req.file.filename,
        });
        const itemCategory = await ItemCategory.findByIdAndUpdate(
          { _id: req.body.categoryId },
          { itemIds: [id] }
        );

        res.status(200).json({
          id: item._id,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          quantity: item.quantity,
          brand: item.brand,
          price: item.price,
          itemImage: item.itemImage,
          categoryId: itemCategory.categoryId,
          categoryName: itemCategory.categoryName,
        });
      }

      // const check = await ItemCategory.findByIdAndUpdate(
      //   { _id: getItemValue.categoryId },
      //   { itemIds: [id] },
      //   { $pull: { itemIds: [id] } }
      // );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const path = process.env.FILE_PATH;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not Found !" });
    }
    await Item.findByIdAndDelete(id);
    await fs.promises.unlink(path + item.itemImage);

    res.status(200).json({ message: "Item is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { filePath } = req.params;
    const path = process.env.FILE_PATH;
    const response = path + filePath;
    res.sendFile(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getNewArrivalItems,
  getItemBySearch,
  getItemByCategoryId,
  createItem,
  updateItem,
  deleteItem,
  downloadFile,
  filterItemByCategoryIdAndSearch,
};
