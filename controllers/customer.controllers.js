const Customer = require("../models/customer.model.js");
const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// configuration file
dotenv.config();

const getCustomers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const customer = await Customer.find({
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

    const response = customer.map((value) => {
      return {
        id: value._id,
        fullName: value.userId[0].fullName,
        firstName: value.userId[0].firstName,
        middleName: value.userId[0].middleName,
        lastName: value.userId[0].lastName,
        username:value.userId[0].username,
        phone: value.userId[0].phone,
        email: value.userId[0].email,
        email: value.userId[0].email,
        profileImage: value.userId[0].profileImage,
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

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer is not Found !" });
    }
    const user = await User.findById(customer.userId);
    const role = await Role.findById(user.roleIds);
    res.status(200).json({
      id: customer._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      fullName: user.fullName,
      username:user.username,
      phone: user.phone,
      email: user.email,
      token: user.token,
      userId: user._id,
      registrationDate: user.registrationDate,
      address: customer.address,
      subCity: customer.subCity,
      town: customer.town,
      roleId: role._id,
      roleName: role.roleName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const role = await Role.findById(req.body.roleId);
    const existCustomer = await User.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone },
        { username: req.body.username },
      ],
    });

    if (existCustomer != null) {
      return res.status(500).json({
        message: "Customer is already exist !",
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
          roleIds: role._id,
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

      const customer = await Customer.create({
        address: req.body.address,
        subCity: req.body.subCity,
        town: req.body.town,
        userId: user._id,
      });

      res.status(200).json({
        id: customer._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        registrationDate: user.registrationDate,
        address: customer.address,
        subCity: customer.subCity,
        town: customer.town,
        roleId: role._id,
        roleName: role.roleName,
        userId: customer.userId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (customer == null) {
      res.status(400).json({ message: "Customer not Exist !" });
    } else {
      const updateCustomer = await Customer.findByIdAndUpdate(customer._id, {
        address: req.body.address,
        subCity: req.body.subCity,
        town: req.body.town,
      });

      const updateUser = await User.findByIdAndUpdate(customer.userId, {
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
        id: customer._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        registrationDate: updateUser.registrationDate,
        address: updateCustomer.address,
        subCity: updateCustomer.subCity,
        town: updateCustomer.town,
        userId: updateCustomer.userId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer is not Found !" });
    }

    await User.findByIdAndDelete(customer.userId);
    await Customer.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer Deleted Successfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
