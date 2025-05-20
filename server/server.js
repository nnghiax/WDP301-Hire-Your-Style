const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const apiCate = require("./router/apiCate");
const apiAuth = require("./router/apiAuth");
const apiRequest = require('./router/apiRequest')
const apiStore = require('./router/apiStore')

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

app.use("/auth", apiAuth);

app.use("/cate", apiCate);

app.use('/request', apiRequest)

app.use('/store', apiStore)

app.listen(port, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
