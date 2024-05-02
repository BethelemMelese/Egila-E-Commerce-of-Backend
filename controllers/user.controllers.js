const User = require("../models/user.model.js");

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
    console.log("The Find Add result is:", user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    // const {get} = req.body;
    // get.fullName= get.firstName + "" + get.lastName;
    // console.log("get...",get)
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
  createUser,
  updateUser,
  deleteUser
};
