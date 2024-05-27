const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.route.js");
const itemCategoryRoutes = require("./routes/itemCategory.route.js");
const item = require("./routes/item.route.js");
const userProfile = require("./routes/userProfile.route.js");
const role = require("./routes/role.route.js");
const customer = require("./routes/customer.route.js");
const admin = require("./routes/admin.route.js");
const salesPerson = require("./routes/salesPerson.route.js");
const deliveryPerson = require("./routes/deliveryPerson.route.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Allowing incoming request from any IP

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'Content-Type' : 'multipart/form-data' ,* "
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// configuration file
dotenv.config();

// routes
app.use("/api/users", userRoutes);
app.use("/api/itemCategorys", itemCategoryRoutes);
app.use("/api/items", item);
app.use("/api/userProfiles", userProfile);
app.use("/api/roles", role);
app.use("/api/customers", customer);
app.use("/api/admins", admin);
app.use("/api/salesPersons", salesPerson);
app.use("/api/deliveryPersons", deliveryPerson);

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

// When you need to retrieve the file later, you can use the stored file path to access the file from the file system.
//  For example, you can serve the file using a route handler like this:
app.get("/uploads/:filePath", (req, res) => {
  const { filePath } = req.params;
  res.sendFile(path.join(__dirname, "uploads", filePath));
});
