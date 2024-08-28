const Item = require("../models/item.model.js");
const ItemCategory = require("../models/itemCategory.model.js");
const Order = require("../models/order.model.js");
const Payment = require("../models/payment.model.js");

const generateReport = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.find({ orderStatus: orderStatus });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { generateReport };
