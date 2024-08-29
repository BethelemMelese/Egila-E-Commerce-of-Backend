const Item = require("../models/item.model.js");
const ItemCategory = require("../models/itemCategory.model.js");
const dotenv = require("dotenv");
const fs = require("fs");

// configuration file
dotenv.config();

const getItemCategorys = async (req, res) => {
  try {
    const search = req.query.search || "";

    const itemCategory = await ItemCategory.find({
      categoryName: { $regex: search},
    });
    const response = itemCategory.map((value) => {
      return {
        id: value._id,
        categoryName: value.categoryName,
        categoryDescription: value.categoryDescription,
        categoryImage: value.categoryImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemCategoryNames = async (req, res) => {
  try {
    const search = req.query.search || "";

    const itemCategory = await ItemCategory.find({
      categoryName: { $regex: search},
    });
    const response = itemCategory.map((value) => {
      return {
        id: value._id,
        categoryName: value.categoryName,
        categoryDescription: value.categoryDescription,
        categoryImage: value.categoryImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const itemCategory = await ItemCategory.findById(id).populate("itemIds");

    res.status(200).json({
      id: itemCategory._id,
      categoryName: itemCategory.categoryName,
      categoryDescription: itemCategory.categoryDescription,
      categoryImages: itemCategory.categoryImages,
      itemIds: itemCategory.itemIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItemCategory = async (req, res) => {
  try {
    const existCategory = await ItemCategory.findOne({
      categoryName: req.body.categoryName,
    });
    if (existCategory != null) {
      return res.status(500).json({
        message: "Category is already exist, please insert new category !",
      });
    } else {
      const formData = {
        categoryName: req.body.categoryName,
        categoryDescription: req.body.categoryDescription,
        categoryImage: req.file.filename,
      };
      const itemCategory = await ItemCategory.create(formData);

      res.status(200).json({
        id: itemCategory._id,
        categoryName: itemCategory.categoryName,
        categoryDescription: itemCategory.categoryDescription,
        categoryImage: itemCategory.categoryImage,
        itemIds: itemCategory.itemIds,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadCategoryImage = async (req, res) => {
  try {
    const formData = {
      categoryName: req.body.categoryName,
      categoryDescription: req.body.categoryDescription,
      categoryImage: req.file.filename,
    };
    const itemCategory = await ItemCategory.create(formData);
    res.status(200).json(itemCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const itemCategory = await ItemCategory.findById(id);
    if (!itemCategory) {
      return res.status(404).json({ message: "Category not Found !" });
    }

    if (itemCategory.categoryImage == req.body.file) {
      await ItemCategory.findByIdAndUpdate(id, {
        categoryName: req.body.categoryName,
        categoryDescription: req.body.categoryDescription,
      });
    } else {
      await ItemCategory.findByIdAndUpdate(id, {
        categoryName: req.body.categoryName,
        categoryDescription: req.body.categoryDescription,
        categoryImage: req.file.filename,
      });
    }

    const updatedItemCategory = await ItemCategory.findById(id);
    res.status(200).json({
      id: updatedItemCategory._id,
      categoryName: updatedItemCategory.categoryName,
      categoryDescription: updatedItemCategory.categoryDescription,
      categoryImage: updatedItemCategory.categoryImage,
      itemIds: updatedItemCategory.itemIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const path = process.env.FILE_PATH;
    const itemCategory = await ItemCategory.findById(id);

    if (!itemCategory) {
      return res.status(404).json({ message: "Category not Found !" });
    }
    await ItemCategory.findByIdAndDelete(id);
    await fs.promises.unlink(path + itemCategory.categoryImage);

    res.status(200).json({ message: "Category is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { filePath } = req.params;
    const path = process.env.FILE_PATH;
    console.log("path...",path);
    const response = path + filePath;
    console.log("response...",response);
    res.sendFile(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItemCategorys,
  getItemCategoryById,
  getItemCategoryNames,
  createItemCategory,
  uploadCategoryImage,
  downloadFile,
  updateItemCategory,
  deleteItemCategory,
};
