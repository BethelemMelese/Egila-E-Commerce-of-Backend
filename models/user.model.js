const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please enter first name"],
    },
    password: {
      type: String,
      required: [true, "please enter password"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: Date,
      required: false,
    },
    profileIds: [{ type: mongoose.Types.ObjectId, ref: "UserProfile",required: false, }],
    // for Many to Many relationship the attribute has to be defined on both models just like in User,
    // In the item also has object list of items.
    itemIds: [{ type: mongoose.Types.ObjectId, ref: "Item",required: false, }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
