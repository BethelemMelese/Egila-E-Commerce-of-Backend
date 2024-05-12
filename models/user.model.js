const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please insert First Name"],
    },
    middleName: {
      type: String,
      required: [true, "Please insert middle Name"],
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
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "please insert username"],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: Date,
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
