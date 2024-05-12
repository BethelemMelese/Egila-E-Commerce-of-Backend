const UserProfile = require("../models/profile.model.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

const getUserProfiles = async (req, res) => {
  try {
    const userProfile = await UserProfile.find({});
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await UserProfile.findById(id);
    if (!userProfile) {
      res.status(404).json({ message: "User Profile is Not Found !" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createUserProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      fullName:
        req.body.firstName +
        " " +
        req.body.middleName +
        " " +
        req.body.lastName,
    });

    const passwordHash = bcrypt.hash(req.body.password, process.env.BCRYPT_SALT_ROUNDS);
    const token = await jwt.sign(
      {
        id: userProfile._id,
        time: Date(),
        name:
          req.body.firstName +
          " " +
          req.body.middleName +
          " " +
          req.body.lastName,
        email: req.body.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 3600000,
      }
    );
    console.log("token...", token);

    const user = await User.create({
      username: req.body.username,
      profileIds: userProfile._id,
      token: token,
      passwordHash: passwordHash,
      registrationDate: Date(),
    });

    res.status(200).json({
      firstName: userProfile.firstName,
      middleName: userProfile.middleName,
      lastName: userProfile.lastName,
      phone: userProfile.phone,
      email: userProfile.email,
      fullName: userProfile.fullName,
      username: user.username,
      password: user.password,
      profileIds: user.profileIds,
      passwordHash: user.passwordHash,
      registrationDate: user.registrationDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      fullName:
        req.body.firstName +
        " " +
        req.body.middleName +
        " " +
        req.body.lastName,
    };
    const userProfile = await UserProfile.findByIdAndUpdate(id, data);

    if (!userProfile) {
      return res.status(404).json({ message: "User Profile not Found !" });
    }

    const updatedUserProfile = await UserProfile.findById(id);
    res.status(200).json(updatedUserProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await UserProfile.findByIdAndDelete(id);

    if (!userProfile) {
      return res.status(404).json({ message: "User Profile not Found !" });
    }

    res.status(200).json({ message: "User Profile is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfiles,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
