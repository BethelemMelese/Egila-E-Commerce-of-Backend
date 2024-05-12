const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema(
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
    fullName: {
      type: String,
      required: [true, "Please insert Full Name"],
    },
  },
  {
    timestamps: true,
  }
);

// const UserProfile=mongoose.model("UserProfile", userProfileSchema);
// module.exports=UserProfile;
module.exports = mongoose.model("UserProfile", userProfileSchema);
