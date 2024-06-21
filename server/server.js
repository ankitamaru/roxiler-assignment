const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// seed database api

app.use("/node/v2/api/transactions", transactionRoutes);


const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server running on port: ${port}`);
  }
});
