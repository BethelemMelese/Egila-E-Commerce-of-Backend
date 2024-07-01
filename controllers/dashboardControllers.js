const Customer = require("../models/customer.model.js");
const User = require("../models/user.model.js");
const Order = require("../models/order.model.js");
const SalesPerson = require("../models/salesPerson.model.js");
const DeliveryPerson = require("../models/deliveryPerson.model.js");
const Item = require("../models/item.model.js");
const Cart = require("../models/cart.model.js");
const Category = require("../models/itemCategory.model.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

const getCountCustomer = async (req, res) => {
  try {
    const customer = await Customer.find();
    res.status(200).json(customer.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCountDeliveries = async (req, res) => {
  try {
    const deliveries = await DeliveryPerson.find();
    res.status(200).json(deliveries.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCountSalesPerson = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.find();
    res.status(200).json(salesPerson.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCountOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentOrder = async (req, res) => {
  try {
    const cart = await Cart.find().sort({ createdAt: -1 }).limit(8).populate({
      path: "itemIds",
      select: "-__v",
    });
    const response = cart.map((value) => {
      return {
        id: value._id,
        itemName: value.itemIds[0].itemName,
        itemDescription: value.itemIds[0].itemDescription,
        quantity: value.quantity,
        subTotal: value.subTotal,
        price: value.itemIds[0].price,
        itemImage: value.itemIds[0].itemImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSalesList = async (req, res) => {
  try {
    const sales = await Cart.find().populate({
      path: "itemIds",
      select: "-__v",
    });
    let quantity = 0;
    const salesPerMonth = sales.reduce((acc, sale) => {
      const monthYear = `${
        sale.createdAt.getMonth() + 1
      }-${sale.createdAt.getFullYear()}`;
      quantity = quantity + sale.quantity;
      const salesList = {
        name: monthYear,
        quantity: quantity,
        item: sales.length,
      };
      return salesList;
    }, {});
    res.status(200).json([salesPerMonth]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentCategory = async (req, res) => {
  try {
    const category = await Category.find();
    const response = category.map((value) => {
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

const getCurrentItem = async (req, res) => {
  try {
    const item = await Item.find();
    const response = item.map((value) => {
      return {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        itemImage: value.itemImage,
        quantity: value.quantity,
        price: value.price,
        brand: value.brand,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentCustomerOrder = async (req, res) => {
  try {
    const { uuId } = req.params;
    let cartList;

    const cart = await Cart.find({
      uUID: uuId,
      cartStatus: "Ongoing",
    }).populate({
      path: "itemIds",
      select: "-__v",
    });
    cartList = cart.map((value) => {
      return {
        id: value._id,
        itemName: value.itemIds[0].itemName,
        itemDescription: value.itemIds[0].itemDescription,
        itemImage: value.itemIds[0].itemImage,
        price: `${value.itemIds[0].price} (ETB)`,
        quantity: value.quantity,
        brand: value.itemIds[0].brand,
        subTotal: `${value.subTotal} (ETB)`,
        cartStatus: value.cartStatus,
      };
    });

    res.status(200).json(cartList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentNewArrivalItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).limit(4);
    const response = items.map((value) => {
      return {
        id: value._id,
        itemName: value.itemName,
        itemDescription: value.itemDescription,
        quantity: value.quantity,
        price: value.price,
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

module.exports = {
  getCountCustomer,
  getCountDeliveries,
  getCountSalesPerson,
  getCountOrders,
  getRecentOrder,
  getSalesList,
  getCurrentCategory,
  getCurrentItem,
  getCurrentCustomerOrder,
  getCurrentNewArrivalItems,
};
