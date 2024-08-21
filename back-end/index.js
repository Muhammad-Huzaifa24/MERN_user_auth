const express = require("express");
const { connectMongoDb } = require("./connection");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const app = express();

// Middlewares
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connect mongoDb
connectMongoDb(process.env.MONGODB_URL_REMOTE).then(() => {
  console.log("MongoDb connected");
});

// Route
app.use("/api", userRoutes);

// default route
app.get("/", (req, res) => {
  res.send("<h1>Hello from back end</h1>");
});
app.get("/server", (req, res) => {
  res.send("<h1>this is server route</h1>");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running at port:- ${PORT}`);
});
