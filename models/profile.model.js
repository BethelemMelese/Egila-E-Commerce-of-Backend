const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter First Name"],
  },
  middleName: {
    type: String,
    required: [true, "Please enter middle Name"],
  },
  lastName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: [true, "Please enter Phone Number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter Email Address"],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Please enter Full Name"],
  },
},
{
  timestamps: true,
}
);

// const UserProfile=mongoose.model("UserProfile", userProfileSchema);
// module.exports=UserProfile;
module.exports = mongoose.model("UserProfile", userProfileSchema);
