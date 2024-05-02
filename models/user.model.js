const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter first name"]
    },

    lastName: {
      type: String,
      required: [true, "please enter last name"]
    },

    email: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: [true, "please enter phone number"]
    },
    password: {
      type: String,
      required: [true, "please enter password"]
    },
    passwordHash: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    registrationDate: {
      type: Date,
      required: false
    },
  },
  {
    timestamps: true
  }
);


const User=mongoose.model("User",UserSchema);
module.exports=User;