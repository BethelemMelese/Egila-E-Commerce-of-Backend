const mongoose = require("mongoose");

const SalesPersonSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "please enter address"],
    },
    userId: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
  },
  {
    timestamps: true,
  }
);

const SalesPerson = mongoose.model("SalesPerson", SalesPersonSchema);
module.exports = SalesPerson;
