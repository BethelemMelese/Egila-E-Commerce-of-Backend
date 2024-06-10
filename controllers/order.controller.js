const Customer = require("../models/customer.model.js");
const User = require("../models/user.model.js");
const Order = require("../models/order.model.js");
const Payment = require("../models/payment.model.js");
const Item = require("../models/item.model.js");
const Cart = require("../models/cart.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createOrder = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    let array = [];
    let totalAmount = 0;

    const cartIds = await Cart.find({ uUID: req.body.uuId });
    cartIds.forEach((element) => {
      array.push(element.id);
    });

    cartIds.forEach((element) => {
      totalAmount = totalAmount + element.subTotal;
    });

    const saltRounds = 10;
    const password = bcrypt.hashSync(req.body.phone, saltRounds);
    if (user == null) {
      await User.create({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        username: req.body.phone,
        passwordHash: password,
        fullName:
          req.body.firstName +
          " " +
          req.body.middleName +
          " " +
          req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      }).then((response) => {
        Customer.create({
          address: req.body.address,
          subCity: req.body.subCity,
          town: req.body.town,
          userId: response._id,
        }).then((secondResponse) => {
          Order.create({
            totalAmount: totalAmount,
            orderOwner:
              req.body.firstName +
              " " +
              req.body.middleName +
              " " +
              req.body.lastName,
            orderPhone: req.body.phone,
            orderDate: new Date(),
            orderStatus: "Pending",
            shoppingAddress:
              req.body.town + "," + req.body.subCity + "," + req.body.address,
            cartIds: array,
            customerIds: secondResponse._id,
          }).then((orderResponse) => {
            Payment.create({
              paymentMethod: req.body.paymentMethod,
              paymentSlip: req.file.filename,
              paymentStatus: "Payed",
              orderIds: orderResponse._id,
              customerIds: orderResponse.customerIds,
            });
          });
        });
      });
    } else {
      const customer = await Customer.findOne({ userId: user._id });
      await Order.create({
        orderOwner:
          req.body.firstName +
          " " +
          req.body.middleName +
          " " +
          req.body.lastName,
        orderPhone: req.body.phone,
        totalAmount: totalAmount,
        orderDate: new Date(),
        orderStatus: "Pending",
        shoppingAddress:
          req.body.address + "," + req.body.subCity + "," + req.body.town,
        cartIds: array,
        customerIds: customer._id,
      }).then((orderResponse) => {
        Payment.create({
          paymentMethod: req.body.paymentMethod,
          paymentSlip: req.file.filename,
          paymentStatus: "Payed",
          orderIds: orderResponse._id,
          customerIds: orderResponse.customerIds,
        });
      });
    }

    res.status(200).json({ message: "Order is Successfully Created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const search = req.query.search || "";
    const order = await Order.find({
      orderOwner: { $regex: search, $options: "i" },
      orderStatus: { $regex: search, $options: "i" },
      shoppingAddress: { $regex: search, $options: "i" },
      shoppingAddress: { $regex: search, $options: "i" },
    })
      .populate({
        path: "customerIds",
        select: "-__v",
      })
      .select("-__v");
    res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order is not Found !" });
    }

    res.status(200).json({ message: "Order Deleted Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  deleteOrder,
};
