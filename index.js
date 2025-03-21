const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

mongoose.connect(
  "mongodb+srv://<db_user>:<db_pass>@cluster0.rogdtil.mongodb.net//<db_name>?retryWrites=true&w=majority&appName=Cluster0"
);

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const { body } = req;
  console.log({ body });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
