const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const apiAuth = require("./router/apiAuth");
const apiCate = require("./router/apiCate");
const apiRequest = require("./router/apiRequest");
const apiStore = require("./router/apiStore");
const apiProduct = require("./router/apiProduct");
const apiCart = require("./router/apiCart");
const apiUser = require("./router/apiUser");

const apiAdmin = require("./router/adminProductRoutes");

const apiRevenue = require("./router/apiRevenue");


const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const url = process.env.URL;
const dbName = process.env.DBNAME;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(`${url}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// AUTHENTICATION
app.use("/auth", apiAuth);

// CATEGORY
app.use("/cate", apiCate);

// STORE REQUEST
app.use("/request", apiRequest);

// STORE
app.use("/store", apiStore);

// PRODUCT
app.use("/product", apiProduct);

// CART
app.use("/cart", apiCart);

// USER
app.use("/user", apiUser);


app.use('/admin', apiAdmin); 

// REVENUE
app.use("/revenue", apiRevenue);


app.listen(port, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
