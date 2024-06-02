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
    const search = req.query.search || "";

    const salesPerson = await SalesPerson.find({
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

    const response = salesPerson.map((value) => {
      return {
        id: value._id,
        fullName: value.userId[0].fullName,
        firstName: value.userId[0].firstName,
        middleName: value.userId[0].middleName,
        lastName: value.userId[0].lastName,
        phone: value.userId[0].phone,
        email: value.userId[0].email,
        username: value.userId[0].username,
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
    const role = await Role.findOne({ roleName: "Sales Person" });
    const isExistUser = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email },
        { phone: req.body.phone },
      ],
    });

    if (isExistUser != null) {
      return res.status(500).json({
        message: "Sales Person is already exist !",
      });
    } else {
      const generateToken = jwt.sign(
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
      const userPassword = "Q@" + req.body.username;
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
    const { id } = req.params;
    const salesPerson = await SalesPerson.findById(id);
    if (salesPerson == null) {
      res.status(400).json({ message: "Sales Person not Exist !" });
    } else {
      const updateSalesPerson = await SalesPerson.findByIdAndUpdate(
        salesPerson._id,
        {
          address: req.body.address,
          subCity: req.body.subCity,
          town: req.body.town,
        }
      );

      const updateUser = await User.findByIdAndUpdate(salesPerson.userId, {
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
        id: salesPerson._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        registrationDate: updateUser.registrationDate,
        address: updateSalesPerson.address,
        subCity: updateSalesPerson.subCity,
        town: updateSalesPerson.town,
        userId: updateSalesPerson.userId,
      });
    }
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

    res.status(200).json({ message: "Sales Person is Successfully Deleted !" });
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
