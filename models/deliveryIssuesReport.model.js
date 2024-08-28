const mongoose = require("mongoose");

const DeliveryIssuesReportSchema = mongoose.Schema(
  {
    issueName: {
      type: String,
      required: [true, "please insert issue name"],
    },
    issueDescription: {
      type: String,
      required: false,
    },
    issueStatus: {
      type: String,
      required: [true, "please insert issue status"],
    },
    deliveryPersonIds: [
      { type: mongoose.Types.ObjectId, ref: "DeliveryPerson", required: false },
    ],
    orderIds: [
      { type: mongoose.Types.ObjectId, ref: "Order", required: false },
    ],
  },
  {
    timestamps: true,
  }
);

const DeliveryIssuesReport = mongoose.model(
  "DeliveryIssuesReport",
  DeliveryIssuesReportSchema
);
module.exports = DeliveryIssuesReport;
