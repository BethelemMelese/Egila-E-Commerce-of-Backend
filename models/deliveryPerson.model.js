const mongoose = require("mongoose");

const DeliveryPersonSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "please insert address"],
    },
    userId: [{ type: mongoose.Types.ObjectId, ref: "User", required: false }],
    orderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false,
      },
    ],
    deliveryReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryIssuesReport",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPerson = mongoose.model("DeliveryPerson", DeliveryPersonSchema);
module.exports = DeliveryPerson;
