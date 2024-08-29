const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.route.js");
const itemCategoryRoutes = require("./routes/itemCategory.route.js");
const item = require("./routes/item.route.js");
const role = require("./routes/role.route.js");
const customer = require("./routes/customer.route.js");
const admin = require("./routes/admin.route.js");
const salesPerson = require("./routes/salesPerson.route.js");
const deliveryPerson = require("./routes/deliveryPerson.route.js");
const cart = require("./routes/cart.route.js");
const order = require("./routes/order.route.js");
const payment = require("./routes/payment.route.js");
const dashboard = require("./routes/dashboard.route.js");
const comment = require("./routes/comment.route.js");
const report=require("./routes/report.route.js");
const issuesReport=require("./routes/deliveryIssuesReport.route.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var whitelist = ["http://localhost:3000", "https://egila-gadgets.netlify.app/"];
var corsOptions = { origin: whitelist, credentials: true };
app.use(cors(corsOptions));

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
app.use("/api/roles", role);
app.use("/api/customers", customer);
app.use("/api/admins", admin);
app.use("/api/salesPersons", salesPerson);
app.use("/api/deliveryPersons", deliveryPerson);
app.use("/api/carts", cart);
app.use("/api/orders", order);
app.use("/api/payments", payment);
app.use("/api/dashboard", dashboard);
app.use("/api/comments", comment);
app.use("/api/reports",report);
app.use("/api/issuesReports",issuesReport);

app.get("/", (req, res) => {
  res.send("The Server Side running Successfully");
});

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
