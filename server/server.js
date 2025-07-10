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
const PayOS = require("@payos/node");
const apiAdmin = require("./router/adminProductRoutes");
const apiPayos = require("./router/apiPayos");
const apiRevenue = require("./router/apiRevenue");
const apiRental = require("./router/apiRental");
const apiAdminUser = require("./router/apiAdminUser");
const apiReview = require("./router/apiReview");
const apiBlog = require("./router/apiBlog");
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const url = process.env.URL;
const dbName = process.env.DBNAME;

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const payos = new PayOS("client_id", "api-key", "checksum_key");

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

app.use("/admin", apiAdmin);

// REVENUE
app.use("/revenue", apiRevenue);

// PAYOS
app.use("/payos", apiPayos);

app.use("/rental", apiRental);

app.use("/admin", apiAdminUser);

app.use("/review", apiReview);

// BLOG
app.use("/blog", apiBlog);

app.listen(port, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
