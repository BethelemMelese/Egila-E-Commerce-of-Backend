const User = require("../models/user.model.js");
const Admin = require("../models/admin.model.js");
const Customer = require("../models/customer.model.js");
const SalesPerson = require("../models/salesPerson.model.js");
const DeliveryPerson = require("../models/deliveryPerson.model.js");
const Role = require("../models/role.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const permissions = require("../models/permissions.js");

// configuration file
dotenv.config();

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByUserName = async (req, res) => {
  try {
    const userName = req.params.username;
    const user = await User.findOne({ userName }).populate("roleIds");
    if (!user) {
      return res.status(404).json({ message: "The User is not Found !" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByRoleId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ roleIds: id }).populate("roleIds");
    if (!user) {
      return res.status(404).json({ message: "The User is not Found !" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User is not Found, Please insert correctly !" });
    }

    const role = await Role.findById(user.roleIds);
    const generateToken = jwt.sign(
      {
        id: user._id,
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

    const isPasswordMatch = bcrypt.compareSync(password, user.passwordHash);

    if (user && isPasswordMatch) {
      const userPermissions = new permissions().getPermissionsByRoleName(
        role.roleName
      );
      const controllers = new permissions().getControllerByRoleName(
        role.roleName
      );

      await User.findByIdAndUpdate(user._id, {
        token: generateToken,
      });

      const updatedUser = await User.findOne({ username });
      res.status(200).json({
        message: "Login is Successfully Done !",
        token: updatedUser.token,
        role: role.roleName,
        controllers: controllers,
        userPermissions: userPermissions,
      });
    } else if (!isPasswordMatch) {
      res.status(404).json({
        message:
          "The Password is Not Correct, Please insert the correct password !",
      });
    } else {
      res.status(404).json({
        error: "User is not Found, Please insert correctly !",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const logOutUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error, message });
  }
};

const generateToken = async (req, res) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      userId: 12,
    };

    const token = await jwt.sign(data, jwtSecretKey);
    res.send(token);
  } catch (error) {
    res.status(500).json({ message: error, message });
  }
};

const verificationToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const role = await Role.findOne({ roleName: "Customer" });
    const isExistUser = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email },
        { phone: req.body.phone },
      ],
    });

    if (isExistUser != null) {
      const saltRounds = 10;
      const password = bcrypt.hashSync(req.body.password, saltRounds);
      await User.findByIdAndUpdate(isExistUser._id, {
        passwordHash: password,
        username:req.body.username,
        roleIds: role._id,
      });
      const customer = await Customer.find({
        userId: isExistUser._id,
      });

      res.status(200).json({
        id: customer._id,
        firstName: isExistUser.firstName,
        middleName: isExistUser.middleName,
        lastName: isExistUser.lastName,
        fullName: isExistUser.fullName,
        phone: isExistUser.phone,
        email: isExistUser.email,
        registrationDate: isExistUser.registrationDate,
        address: customer.address,
        subCity: customer.subCity,
        town: customer.town,
        roleId: role._id,
        roleName: role.roleName,
        userId: customer.userId,
      });
    } else {
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
        registrationDate: Date(),
        roleIds: role._id,
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not Found !" });
    }

    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not Found !" });
    }

    res.status(200).json({ message: "User is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(id);
    if (user == null) {
      return res
        .status(404)
        .json({ message: "User is not Found, Please insert correctly !" });
    } else {
      const isPasswordMatch = bcrypt.compareSync(
        oldPassword,
        user.passwordHash
      );
      if (!isPasswordMatch) {
        return res.status(404).json({
          message:
            "The Old Password not Correct, please insert the old password correctly!",
        });
      }
      const saltRounds = 10;
      const password = bcrypt.hashSync(newPassword, saltRounds);
      const response = await User.updateOne({ passwordHash: password });
      res.status(200).json({ message: "Password is Successfully Updated !" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User is Not Found !" });
    }

    const updateUserProfile = await User.findByIdAndUpdate(id, {
      profileImage: req.file.filename,
    });

    res.status(200).json({
      id: updateUserProfile._id,
      firstName: updateUserProfile.firstName,
      middleName: updateUserProfile.middleName,
      lastName: updateUserProfile.lastName,
      fullName: updateUserProfile.fullName,
      phone: updateUserProfile.phone,
      email: updateUserProfile.email,
      profileImage: updateUserProfile.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User is Not Found !" });
    }

    const updateUser = await User.findByIdAndUpdate(id, {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      fullName:
        req.body.firstName +
        " " +
        req.body.middleName +
        " " +
        req.body.lastName,
    });

    if (req.body.roleName == "Customer") {
      const getCustomer = await Customer.findOne({ userId: req.body.id });
      const customer = await Customer.findByIdAndUpdate(getCustomer._id, {
        address: req.body.address,
        subCity: req.body.subCity,
        town: req.body.town,
      });
      res.status(200).json({
        id: updateUser._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        profileImage: updateUser.profileImage,
        address: customer.address,
        subCity: customer.subCity,
        town: customer.town,
      });
    } else if (req.body.roleName == "Admin") {
      const getAdmin = await Admin.findOne({ userId: req.body.id });
      const admin = await Admin.findByIdAndUpdate(getAdmin._id, {
        address: req.body.address,
      });
      res.status(200).json({
        id: updateUser._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        profileImage: updateUser.profileImage,
        address: admin.address,
      });
    } else if (req.body.roleName == "Sales Person") {
      const getSalesPerson = await SalesPerson.findOne({ userId: req.body.id });
      const salesPerson = await SalesPerson.findByIdAndUpdate(
        getSalesPerson._id,
        {
          address: req.body.address,
        }
      );
      res.status(200).json({
        id: updateUser._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        profileImage: updateUser.profileImage,
        address: salesPerson.address,
      });
    } else if (req.body.roleName == "Delivery Person") {
      const getDeliveryPerson = await DeliveryPerson.findOne({
        userId: req.body.id,
      });
      const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
        getDeliveryPerson._id,
        {
          address: req.body.address,
        }
      );
      res.status(200).json({
        id: updateUser._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        profileImage: updateUser.profileImage,
        address: deliveryPerson.address,
      });
    } else {
      res.status(200).json({
        id: updateUser._id,
        firstName: updateUser.firstName,
        middleName: updateUser.middleName,
        lastName: updateUser.lastName,
        fullName: updateUser.fullName,
        phone: updateUser.phone,
        email: updateUser.email,
        profileImage: updateUser.profileImage,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ token: token });
    if (!user) {
      res.status(404).json({ message: "User not Found !" });
    }

    const role = await Role.findById(user.roleIds);

    if (role.roleName == "Admin") {
      const admin = await Admin.findOne({ userId: user._id });
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage,
        address: admin.address,
        subCity: admin.subCity,
        town: admin.town,
        roleId: role._id,
        roleName: role.roleName,
      });
    } else if (role.roleName == "Customer") {
      const customer = await Customer.findOne({ userId: user._id });
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage,
        address: customer.address,
        subCity: customer.subCity,
        town: customer.town,
        roleId: role._id,
        roleName: role.roleName,
      });
    } else if (role.roleName == "Sales Person") {
      const salesPerson = await SalesPerson.findOne({ userId: user._id });
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage,
        address: salesPerson.address,
        subCity: salesPerson.subCity,
        roleId: role._id,
        roleName: role.roleName,
      });
    } else if (role.roleName == "Delivery Person") {
      const deliveryPerson = await DeliveryPerson.findOne({ userId: user._id });
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage,
        address: deliveryPerson.address,
        subCity: deliveryPerson.subCity,
        town: deliveryPerson.town,
        roleId: role._id,
        roleName: role.roleName,
      });
    } else {
      res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        profileImage: user.profileImage,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadPhoto = async (req, res) => {
  try {
    const { filePath } = req.params;
    const path = process.env.FILE_PATH;
    const response = path + filePath;
    res.sendFile(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserByUserName,
  getUserByRoleId,
  loginUser,
  logOutUser,
  generateToken,
  verificationToken,
  updatePassword,
  updateProfile,
  updateProfileImage,
  getUserByToken,
  downloadPhoto,
  createUser,
  updateUser,
  deleteUser,
};
