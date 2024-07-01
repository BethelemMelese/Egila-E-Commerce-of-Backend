const Customer = require("../models/customer.model.js");
const User = require("../models/user.model.js");
const Deliveries = require("../models/deliveryPerson.model.js");
const Order = require("../models/order.model.js");
const Payment = require("../models/payment.model.js");
const Item = require("../models/item.model.js");
const Cart = require("../models/cart.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

const createOrder = async (req, res) => {
  try {
    const user = await User.findOne({
      phone: req.body.phone,
    });
    let array = [];
    let totalAmount = 0;

    const cartIds = await Cart.find({
      uUID: req.body.uuId,
      cartStatus: "Pending",
    });
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
      const cart = await Cart.findOne({ uUID: req.body.uuId });
      await Cart.findByIdAndUpdate(cart._id, {
        cartStatus: "Ongoing",
      });
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
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let order;
    jwt.verify(req.token, jwtSecretKey, async (err, autoData) => {
      if (err) res.status(403).json({ message: "Permission not allowed" });
      else {
        if (autoData.roleName == "Sales Person") {
          order = await Order.find({
            orderOwner: { $regex: search },
            orderStatus: { $regex: search },
            shoppingAddress: { $regex: search },
          })
            .populate({
              path: "customerIds",
              select: "-__v",
            })
            .select("-__v");

          const response = order.map((value) => {
            return {
              id: value._id,
              orderOwner: value.orderOwner,
              orderPhone: value.orderPhone,
              totalAmount: value.totalAmount,
              orderDate: value.orderDate,
              orderStatus: value.orderStatus,
              shoppingAddress: value.shoppingAddress,
              cartIds: value.cartIds,
              customerIds: value.customerIds,
              deliveryPersonId: value.deliveryPersonId,
              isAssign: value.deliveryPersonId == null ? false : true,
            };
          });
          res.status(200).json(response);
        } else if (autoData.roleName == "Customer") {
          const user = await User.findOne({ email: autoData.email });
          const customer = await Customer.findOne({ userId: user._id });
          order = await Order.find({ customerIds: customer._id })
            .populate({
              path: "customerIds",
              select: "-__v",
            })
            .populate({
              path: "deliveryPersonId",
              select: "-__v",
            })
            .select("-__v");

          const response = order.map((value) => {
            return {
              id: value._id,
              orderOwner: value.orderOwner,
              orderPhone: value.orderPhone,
              totalAmount: value.totalAmount,
              orderDate: value.orderDate,
              orderStatus: value.orderStatus,
              shoppingAddress: value.shoppingAddress,
              cartIds: value.cartIds,
              customerIds: value.customerIds._id,
              deliveryPersonId: value.deliveryPersonId,
              isAssign: value.deliveryPersonId == null ? false : true,
            };
          });

          res.status(200).json(response);
        } else {
          const deliveries = await Deliveries.findOne({
            userId: autoData.id,
          });
          order = await Order.find({ deliveryPersonId: deliveries._id })
            .populate({
              path: "customerIds",
              select: "-__v",
            })
            .populate({
              path: "deliveryPersonId",
              select: "-__v",
            })
            .select("-__v");

          const response = order.map((value) => {
            return {
              id: value._id,
              orderOwner: value.orderOwner,
              orderPhone: value.orderPhone,
              totalAmount: value.totalAmount,
              orderDate: value.orderDate,
              orderStatus: value.orderStatus,
              shoppingAddress: value.shoppingAddress,
              cartIds: value.cartIds,
              customerIds: value.customerIds._id,
              deliveryPersonId: value.deliveryPersonId,
              isAssign: value.deliveryPersonId == null ? false : true,
            };
          });

          res.status(200).json(response);
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (order == null) {
      return res.status(500).json({
        message: "Order not Found",
      });
    }

    order.cartIds.forEach(async (element) => {
      const cart = await Cart.findByIdAndUpdate(element, {
        cartStatus: "Ongoing",
      });
    });

    const response = await Order.findByIdAndUpdate(id, {
      deliveryPersonId: req.body.deliveryPersonId,
      orderStatus: "Ongoing",
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Deliveries.findById(id);
    const user = await User.findOne({ _id: delivery.userId });

    res.status(200).json({
      fullName: user.fullName,
      phone: user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (order == null) {
      return res.status(500).json({
        message: "Order not Found",
      });
    }

    const response = await Order.findByIdAndUpdate(id, {
      orderStatus: req.body.orderStatus,
    });

    if (req.body.orderStatus == "Accepted") {
      order.cartIds.forEach(async (element) => {
        await Cart.findByIdAndUpdate(element, {
          cartStatus: req.body.orderStatus,
        });
      });

      order.cartIds.forEach(async (element) => {
        const cart = await Cart.findById(element);
        const item = await Item.findById(cart.itemIds);
        await Item.findByIdAndUpdate(cart.itemIds, {
          quantity: item.quantity - cart.quantity,
        });
      });
    } else {
      order.cartIds.forEach(async (element) => {
        await Cart.findByIdAndUpdate(element, {
          cartStatus: req.body.orderStatus,
        });
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  assignDeliveryPerson,
  updateOrderStatus,
  getDeliveryPerson,
  getOrder,
  deleteOrder,
};
