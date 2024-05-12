const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "please insert address"],
    },
    userId: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
