const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please insert First Name"],
    },
    middleName: {
      type: String,
      required: [true, "Please insert Middle Name"],
    },
    lastName: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: [true, "Please insert Full Name"],
    },
    phone: {
      type: String,
      required: [true, "Please insert Phone Number"],
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    username: {
      type: String,
      required:false,
    },
    passwordHash: {
      type: String,
      required: false,
      unique:false,
    },
    token: {
      type: String,
      required: false,
    },
    registrationDate: {
      type: Date,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    roleIds: [{ type: mongoose.Types.ObjectId, ref: "Role", required: false }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
