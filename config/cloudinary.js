const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // add your Cloud name
  api_key: process.env.CLOUD_API_KEY, // add your API Key
  api_secret: process.env.CLOUD_API_SECRET, // add your API Secret
});

module.exports = cloudinary;
