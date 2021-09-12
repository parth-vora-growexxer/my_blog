const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const userRoutes = require("./api/routes/user");
const postRoutes = require("./api/routes/post");

app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
