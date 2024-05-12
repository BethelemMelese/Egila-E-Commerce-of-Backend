const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
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
    const {id} = req.params;
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
    console.log("user...",user);
    if (!user) {
      return res
        .status(404)
        .json({ message: "The User is not Found, Please insert correctly !" });
    }

    const isPasswordMatch = bcrypt.compare(password, user.passwordHash);
    if (user && isPasswordMatch) {
      res.status(200).json({
        message: "Login is Successfully Done !",
        token: user.token,
      });
    } else if (!isPasswordMatch) {
      res.status(401).json({
        message: "The User is not Found, Please insert correctly !",
      });
    } else {
      res.status(404).json({
        error: "The User is not Found, Please insert correctly !",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error, message });
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

const verificationToken = async (req, res) => {
  try {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.status(200).send("Successfully Verified !");
    } else {
      return res.status(401).send("Something is Wrong !");
    }
  } catch (error) {
    res.status(500).json({ message: error, message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
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

module.exports = {
  getUsers,
  getUser,
  getUserByUserName,
  getUserByRoleId,
  loginUser,
  logOutUser,
  generateToken,
  verificationToken,
  createUser,
  updateUser,
  deleteUser,
};
