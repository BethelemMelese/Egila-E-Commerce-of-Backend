const Payment = require("../models/payment.model.js");
const dotenv = require("dotenv");
const fs = require("fs");

// configuration file
dotenv.config();

const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ orderIds: orderId });

    const response={
        id:payment._id,
        paymentMethod:payment.paymentMethod,
        paymentSlip:payment.paymentSlip,
        paymentStatus:payment.paymentStatus
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
    try {
      const { filePath } = req.params;
      const path = process.env.FILE_PATH;
      const response = path + filePath;
      res.sendFile(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
module.exports = {
  getPaymentByOrderId,
  downloadFile
};
