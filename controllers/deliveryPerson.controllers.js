const DeliveryPerson = require("../models/deliveryPerson.model.js");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// configuration file
dotenv.config();

const getDeliveryPersons = async (req, res) => {
  try {
    const search = req.query.search || "";

    const deliveryPerson = await DeliveryPerson.find({
      $or: [
        { address: { $regex: search, $options: "i" } },
        { subCity: { $regex: search, $options: "i" } },
      ],
    })
      .populate({
        path: "userId",
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
        select: "-__v", // Exclude the __v field
      })
      .select("-__v");

    const response = deliveryPerson.map((value) => {
      return {
        id: value._id,
        fullName: value.userId[0].fullName,
        firstName: value.userId[0].firstName,
        middleName: value.userId[0].middleName,
        lastName: value.userId[0].lastName,
        username: value.userId[0].username,
        phone: value.userId[0].phone,
        email: value.userId[0].email,
        userId: value.userId[0]._id,
        address: value.address,
        subCity: value.subCity,
        town: value.town,
        roleId: value.userId[0].roleIds,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeliveryPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPerson = await DeliveryPerson.findById(id);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "DeliveryPerson is not Found !" });
    }
    const user = await User.findById(deliveryPerson.userId);
    const role = await Role.findById(user.roleIds);
    res.status(200).json({
      id: deliveryPerson._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      username: user.username,
      phone: user.phone,
      email: user.email,
      token: user.token,
      userId: user._id,
      registrationDate: user.registrationDate,
      address: deliveryPerson.address,
      roleId: role._id,
      roleName: role.roleName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDeliveryPersonName = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.find().populate({
      path: "userId",
    });

    const response = deliveryPerson.map((value) => {
      return {
        id: value._id,
        fullName: value.userId[0].fullName,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDeliveryPerson = async (req, res) => {
  try {
    const role = await Role.findOne({ roleName: "Delivery Person" });
    const existDeliveryPerson = await User.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone },
        { username: req.body.username },
      ],
    });

    if (existDeliveryPerson != null) {
      return res.status(500).json({
        message: "Delivery Person is already exist !",
      });
    } else {
      const generateToken = await jwt.sign(
        {
          time: Date(),
          name:
            req.body.firstName +
            " " +
            req.body.middleName +
            " " +
            req.body.lastName,
          email: req.body.email,
          roleId: role._id,
          roleName: role.roleName,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 3600000,
        }
      );

      const saltRounds = 10;
      const userPassword = "D@" + req.body.username;
      const password = bcrypt.hashSync(userPassword, saltRounds);
      const user = await User.create({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        fullName:
          req.body.firstName +
          " " +
          req.body.middleName +
          " " +
          req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        passwordHash: password,
        token: generateToken,
        registrationDate: Date(),
        roleIds: role._id,
      });

      const deliveryPerson = await DeliveryPerson.create({
        address: req.body.address,
        userId: user._id,
      });

      res.status(200).json({
        id: deliveryPerson._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        registrationDate: user.registrationDate,
        address: deliveryPerson.address,
        roleId: role._id,
        roleName: role.roleName,
        userId: deliveryPerson.userId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPerson = await DeliveryPerson.findById(id);
    if (deliveryPerson == null) {
      res.status(400).json({ message: "Delivery Person not Exist !" });
    } else {
      const updateDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
        deliveryPerson._id,
        {
          address: req.body.address,
          subCity: req.body.subCity,
          town: req.body.town,
        }
      );

      const updateUser = await User.findByIdAndUpdate(deliveryPerson.userId, {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        fullName:
          req.body.firstName +
          " " +
          req.body.middleName +
          " " +
          req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
      });

      res.status(200).json({
        id: deliveryPerson._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        registrationDate: updateUser.registrationDate,
        address: updateDeliveryPerson.address,
        subCity: updateDeliveryPerson.subCity,
        town: updateDeliveryPerson.town,
        userId: updateDeliveryPerson.userId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPerson = await DeliveryPerson.findById(id);

    if (!deliveryPerson) {
      return res.status(404).json({ message: "DeliveryPerson is not Found !" });
    }

    await User.findByIdAndDelete(deliveryPerson.userId);
    await DeliveryPerson.findByIdAndDelete(id);

    res.status(200).json({ message: "DeliveryPerson Deleted Successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeliveryPersons,
  getDeliveryPersonById,
  getDeliveryPersonName,
  createDeliveryPerson,
  updateDeliveryPerson,
  deleteDeliveryPerson,
};
