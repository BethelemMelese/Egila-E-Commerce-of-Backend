const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, "please insert role name"],
      unique: true,
    },
    roleDescription: {
      type: String,
      required: false,
    },
    userIds: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
