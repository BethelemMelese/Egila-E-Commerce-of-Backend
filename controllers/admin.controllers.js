const Admin = require("../models/admin.model.js");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// configuration file
dotenv.config();

const getAdmins = async (req, res) => {
  try {
    const admin = await Admin.find();

    const result = admin.map((value) => {
      return value.userId;
    });
    const user = await User.findById(result);
    const role = await Role.findById(user.roleIds);
    const response = admin.map((value) => {
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

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin is not Found !" });
    }
    const user = await User.findById(admin.userId);
    const role = await Role.findById(user.roleIds);
    res.status(200).json({
      id: admin._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      token: user.token,
      userId: user._id,
      registrationDate: user.registrationDate,
      address: admin.address,
      roleId: role._id,
      roleName: role.roleName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const role = await Role.findById(req.body.roleId);
    const existAdmin = await Admin.findOne({
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
    });

    if (existAdmin != null) {
      return res.status(500).json({
        message: "Admin is already exist !",
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

      const admin = await Admin.create({
        address: req.body.address,
        userId: user._id,
      });

      res.status(200).json({
        id: admin._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        registrationDate: user.registrationDate,
        address: admin.address,
        roleId: role._id,
        roleName: role.roleName,
        userId: admin.userId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin is not Found !" });
    }

    await User.findByIdAndDelete(admin.userId);
    await Admin.findByIdAndDelete(id);

    res.status(200).json({ message: "Admin Deleted Successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
