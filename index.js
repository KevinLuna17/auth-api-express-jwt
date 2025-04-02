const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const User = require("./user");

mongoose.connect("<tu url a Mongodb>");

const app = express();
app.use(express.json());

//Funcion para firmar tokens
const signToken = (_id) => jwt.sign({ _id }, "tu-token-secreto");

//Middleware para validar JWT
const validateJwt = expressjwt({
  secret: "tu-token-secreto",
  algorithms: ["HS256"],
});

app.post("/register", async (req, res) => {
  const { body } = req;
  console.log({ body });
  try {
    const isUser = await User.findOne({ email: body.email });
    if (isUser) {
      return res.status(403).send("usuario ya se encuentra creado");
    }
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(body.password, salt);
    const user = await User.create({
      email: body.email,
      password: hashed,
      salt,
    });

    const signed = signToken(user._id);
    res.status(201).send(signed);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { body } = req;
  console.log({ body });

  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(403).send("Usuario y/o contrasena invalida");
    } else {
      const isMatch = await bcrypt.compare(body.password, user.password);
      if (isMatch) {
        const signed = signToken(user._id);
        res.status(200).send(signed);
      } else {
        res.status(403).send("Usuario y/o contrasena incorrecta");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

const findAndAssignUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      return res.status(401).send("Usuario no encontrado");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser);

app.get("/lele", isAuthenticated, (req, res) => {
  res.send(req.user);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
