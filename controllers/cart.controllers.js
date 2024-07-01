const Cart = require("../models/cart.model.js");
const Item = require("../models/item.model.js");

const createCart = async (req, res) => {
  try {
    const { itemId, quantity, uuId } = req.body;

    const isExistCart = await Cart.findOne({
      itemIds: itemId,
      uUID: uuId,
      cartStatus: "Pending",
    });
    const item = await Item.findById(itemId);
    let cart;
    if (isExistCart != null) {
      await Cart.findByIdAndUpdate(
        { _id: isExistCart._id },
        {
          quantity: isExistCart.quantity + 1,
          subTotal: isExistCart.subTotal + item.price,
        }
      );
      cart = await Cart.findOne(isExistCart._id);
    } else {
      cart = await Cart.create({
        quantity: quantity,
        itemIds: itemId,
        uUID: uuId,
        addedDate: new Date(),
        subTotal: item.price,
        cartStatus: "Pending",
      });
    }

    const response = {
      id: cart._id,
      quantity: cart.quantity,
      addedDate: cart.addedDate,
      uUID: cart.uUID,
      subTotal: cart.subTotal,
      itemIds: cart.itemIds,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCartCounter = async (req, res) => {
  try {
    const { uuId } = req.params;
    const cart = await Cart.find({
      uUID: uuId,
      $or: [
        {
          cartStatus: "Pending",
        },
        {
          cartStatus: "Ongoing",
        },
        {
          cartStatus: "Denied",
        },
        {
          cartStatus: "Has Issue",
        },
      ],
    });
    res.status(200).json({ counts: cart.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { uuId } = req.params;
    let totalItem = 0;
    let totalPrice = 0;

    const cart = await Cart.find({
      uUID: uuId,
      $or: [
        {
          cartStatus: "Pending",
        },
        {
          cartStatus: "Ongoing",
        },
        {
          cartStatus: "Denied",
        },
        {
          cartStatus: "Has Issue",
        },
      ],
    })
      .populate({
        path: "itemIds",
        select: "-__v",
      })
      .select("-__v");

    const cartList = cart.map((value, index = 1) => {
      return {
        id: value._id,
        uuId: value.uUID,
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

    cart.forEach((element) => {
      totalItem = Number(totalItem + element.quantity);
      totalPrice = Number(totalPrice + element.subTotal);
    });

    const response = {
      totalItem: totalItem,
      totalPrice: `${totalPrice} (ETB)`,
      cartList: cartList,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCartList = async (req, res) => {
  try {
    const ids = req.body.cartIds;
    const cart = await Cart.find({ _id: ids }).populate({
      path: "itemIds",
    });
    const response = cart.map((value) => {
      return {
        id: value._id,
        uuId: value.uUID,
        itemName: value.itemIds[0].itemName,
        itemDescription: value.itemIds[0].itemDescription,
        itemImage: value.itemIds[0].itemImage,
        price: `${value.itemIds[0].price} (ETB)`,
        quantity: value.quantity,
        brand: value.itemIds[0].brand,
        subTotal: `${value.subTotal} (ETB)`,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    let subTotal = 0;
    const cart = await Cart.findById(id);
    if (!cart) {
      res.status(404).json({ message: "Item not found!" });
    }

    const item = await Item.findById(cart.itemIds);
    for (let index = 0; index < req.body.quantity; index++) {
      subTotal = subTotal + item.price;
    }
    const updateCart = await Cart.findByIdAndUpdate(id, {
      quantity: req.body.quantity,
      subTotal: subTotal,
    });

    const response = await Cart.findById(updateCart._id);
    res.status(200).json({
      id: response._id,
      quantity: response.quantity,
      itemName: item.itemName,
      brand: item.brand,
      price: item.price,
      subTotal: response.subTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id);

    if (!cart) {
      return res.status(404).json({ message: "Cart is not Found !" });
    }

    res.status(200).json({ message: "Item Removed from Cart Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartCounter,
  getCart,
  getCartList,
  createCart,
  updateCart,
  deleteCart,
};
