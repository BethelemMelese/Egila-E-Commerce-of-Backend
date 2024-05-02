const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("./models/user.model.js");
const app = express();
app.use(express.json());
dotenv.config();

// Connection with Mongodb Database and run the server
let PORT = process.env.PORT || 5000;
mongoose
  .connect(
    "mongodb+srv://melesebety2673:Admin@ecommercedb.etghbjo.mongodb.net/Node-API"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to database!");
      console.log(`Server is running on port ${PORT} ..`);
    });
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

// the below are a await function for difference end point with their conditions
app.get("/", (req, res) => {
  res.send("Hello from Node Api the server is included");
});


app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users/:id", async (req,res)=>{
  try {
     const {id}=req.params;
     const user=await User.findById(id);
     console.log("The Find Add result is:",user)
     res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
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
