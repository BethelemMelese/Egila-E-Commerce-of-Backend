const Customer = require("../models/customer.model.js");
const User = require("../models/user.model.js");
const Order = require("../models/order.model.js");
const Payment = require("../models/payment.model.js");
const Item = require("../models/item.model.js");
const Cart = require("../models/cart.model.js");

const createOrder = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (user == null) {
      await User.create({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        username: req.body.firstName,
        passwordHash: "",
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
            totalAmount: req.body.totalAmount,
            orderDate: new Date(),
            orderStatus: "Pending",
            shoppingAddress:
              req.body.town + "," + req.body.subCity + "," + req.body.address,
            cartIds: req.body.cartIds,
            customerIds: secondResponse._id,
          }).then((orderResponse) => {
            Payment.create({
              paymentMethod: req.body.paymentMethod,
              paymentSlip: req.body.paymentSlip,
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
        totalAmount: req.body.totalAmount,
        orderDate: new Date(),
        orderStatus: "Pending",
        shoppingAddress:
          req.body.town + "," + req.body.subCity + "," + req.body.address,
        itemIds: req.body.itemIds,
        customerIds: customer._id,
      }).then((orderResponse) => {
        Payment.create({
          paymentMethod: req.body.paymentMethod,
          paymentSlip: req.body.paymentSlip,
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
    const order = await Order.find()
      .populate({
        path: "cartIds",
        select: "-__v",
      })
      .select("-__v");
    console.log("order...", order);
    const response = order.map((value) => {
      const cart = Cart.find({ _id: value.cartIds }).populate(
        {
          path: "itemIds",
          select: "-__v",
        },
        {
          path: "customerIds",
          select: "-__v",
        }
      );

      return cart;
    });

    console.log("cart...", response);
    // const customer= await Customer.find()
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
};
