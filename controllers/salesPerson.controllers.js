const SalesPerson = require("../models/salesPerson.model.js");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// configuration file
dotenv.config();

const getSalesPersons = async (req, res) => {
  try {
    const salesPerson = await SalesPerson.find();

    const result = salesPerson.map((value) => {
      return value.userId;
    });
    const user = await User.findById(result);
    const role = await Role.findById(user.roleIds);
    const response = salesPerson.map((value) => {
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

const getSalesPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesPerson = await SalesPerson.findById(id);
    if (!salesPerson) {
      return res.status(404).json({ message: "Sales Person is not Found !" });
    }
    const user = await User.findById(salesPerson.userId);
    const role = await Role.findById(user.roleIds);
    res.status(200).json({
      id: salesPerson._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      token: user.token,
      userId: user._id,
      registrationDate: user.registrationDate,
      address: salesPerson.address,
      roleId: role._id,
      roleName: role.roleName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSalesPerson = async (req, res) => {
  try {
    const role = await Role.findById(req.body.roleId);
    const existSalesPerson = await SalesPerson.findOne({
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
    });

    if (existSalesPerson != null) {
      return res.status(500).json({
        message: "Sales Person is already exist !",
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

      const salesPerson = await SalesPerson.create({
        address: req.body.address,
        userId: user._id,
      });

      res.status(200).json({
        id: salesPerson._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        registrationDate: user.registrationDate,
        address: salesPerson.address,
        roleId: role._id,
        roleName: role.roleName,
        userId: salesPerson.userId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSalesPerson = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSalesPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const salesPerson = await SalesPerson.findById(id);

    if (!salesPerson) {
      return res.status(404).json({ message: "Sales Person is not Found !" });
    }

    await User.findByIdAndDelete(salesPerson.userId);
    await SalesPerson.findByIdAndDelete(id);

    res.status(200).json({ message: "Sales Person Deleted Successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSalesPersons,
  getSalesPersonById,
  createSalesPerson,
  updateSalesPerson,
  deleteSalesPerson,
};
