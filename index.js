const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.route.js");
const itemCategoryRoutes = require("./routes/itemCategory.route.js");
const item = require("./routes/item.route.js");
const userProfile=require("./routes/userProfile.route.js");
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// configuration file
dotenv.config();

// routes
app.use("/api/users", userRoutes);
app.use("/api/itemCategorys", itemCategoryRoutes);
app.use("/api/items", item);
app.use("/api/userProfiles", userProfile);


// Connection with Mongodb Database and run the server
let PORT = process.env.PORT || 5000;
mongoose
  .connect(
    "mongodb+srv://melesebety2673:Admin@ecommercedb.etghbjo.mongodb.net/Node-API"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} ..`);
    });
    console.log("Connected to database!");

  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

// the below are a await function for difference end point with their conditions
app.get("/", (req, res) => {
  res.send("Hello from Node Api the server is included");
});

// this below function are help for JWT token authentication and verification
app.post("/api/generateToken", async (req, res) => {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      userId: 12,
    };

    const token = await jwt.sign(data, jwtSecretKey);
    res.send(token);
  } catch (error) {
    res.status(500), json({ message: error.message });
  }
});

app.get("/api/validateToken", (req, res) => {
  try {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.status(200).send("Successfully Verified !");
    } else {
      return res.status(401).send("Something is Wrong !");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});
