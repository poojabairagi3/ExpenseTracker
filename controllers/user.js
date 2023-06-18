const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;
    // console.log(name, email, password);
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(201).json({ err: "email already exits" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      // console.log(hashPassword);
      await User.create({
        name: name,
        email: email,
        password: hashPassword,
      });
    }
  }
  catch (err) {
    res.status(500).json(err);
  };
}

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, 'secrectkey');
}

exports.checkPremium = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user);
    if (user) {
      return res.status(200).json({ ispremiummember: user.ispremiummember })
    }
  }
  catch (err) {
    console.log(err);
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
      where: { email: email }
    });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: "something went wrong" });
        }
        if (result === true) {
          return res.status(201).json({ success: true, message: "login successfully", token: generateAccessToken(user.id, user.name, user.ispremiummember) });
        }
        else {
          return res.status(400).json({ success: false, message: "Password incorrect" });
        }
      });

    } else {
      return res.status(404).json({ msg: "user not exist" });
    }
  }
  catch (err) {
    res.status(500).json(err);
  };
}