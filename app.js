require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const bodyParser = require("body-parser");

const app = express();

// app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
// app.use(bodyParser.json()); // for parsing application/json
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", (req, res) => {
  res.send("Hello ");
});

// Register
app.post("/register", urlencodedParser, async (req, res) => {
  try {
    console.log(req.body, " req.body ");
    const { first_name, last_name, email, password } = req.body;
    console.log(
      " first_name, last_name, email, password ",
      first_name,
      last_name,
      email,
      password
    );
    // validate user input
    if (!(email && password && last_name && first_name)) {
      res.status(400).send("All input is required");
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(" error ", err);
  }
});

// Login
app.post("/login", (req, res) => {
  // our login logic goes here
});

module.exports = app;
