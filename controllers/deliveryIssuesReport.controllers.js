const DeliveryIssuesReport = require("../models/deliveryIssuesReport.model.js");
const Order = require("../models/order.model.js");
const DeliveryPerson = require("../models/deliveryPerson.model.js");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// configuration file
dotenv.config();

const getIssueReport = async (req, res) => {
  try {
    const { orderId } = req.params;
    const issueReport = await DeliveryIssuesReport.findOne({
      orderIds: orderId,
    });

    res.status(200).json({
      issueName: issueReport.issueName,
      issueDescription: issueReport.issueDescription,
      issueStatus: issueReport.issueStatus,
      deliveryPersonIds: issueReport.deliveryPersonIds,
      orderIds: issueReport.orderIds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addIssueReport = async (req, res) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const { issueName, issueDescription, orderId } = req.body;
    jwt.verify(req.token, jwtSecretKey, async (err, autoData) => {
      if (err) res.status(403).json({ message: "Permission not allowed" });
      else {
        const deliveryPerson = await DeliveryPerson.findOne({
          userId: autoData.id,
        });
        const issueReport = await DeliveryIssuesReport.create({
          issueName: issueName,
          issueDescription: issueDescription,
          issueStatus: "Has Issue",
          deliveryPersonIds: deliveryPerson._id,
          orderIds: orderId,
        });

        res.status(200).json(issueReport);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIssueReport,
  addIssueReport,
};
