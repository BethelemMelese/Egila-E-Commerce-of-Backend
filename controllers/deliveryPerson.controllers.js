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
    const deliveryPerson = await DeliveryPerson.find();

    const result = deliveryPerson.map((value) => {
      return value.userId;
    });
    const user = await User.findById(result);
    const role = await Role.findById(user.roleIds);
    const response = deliveryPerson.map((value) => {
      return {
        id: value._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        token: user.token,
        userId: user._id,
        registrationDate: user.registrationDate,
        address: value.address,
        roleId: role._id,
        roleName: role.roleName,
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

const createDeliveryPerson = async (req, res) => {
  try {
    const role = await Role.findById(req.body.roleId);
    const existDeliveryPerson = await DeliveryPerson.findOne({
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
    });

    if (existDeliveryPerson != null) {
      return res.status(500).json({
        message: "DeliveryPerson is already exist !",
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
      const password = bcrypt.hashSync(req.body.password, saltRounds);
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
        roleIds: req.body.roleId,
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
  createDeliveryPerson,
  updateDeliveryPerson,
  deleteDeliveryPerson,
};
