const User = require('../models/user');

exports.postUser = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;
    console.log(name, email, password);
    const emailExist = await User.findOne({ where: { email: email } });
    console.log(name, email, password)
    if (name == null || name == undefined || email == null || email == undefined || password == null || password == undefined) {
      return res.status(400).json({ error: "Bad Parameters - Something is Missing" });
    }
    else if (emailExist) {
      res.status(401).json({ message: "email already exist" });
    }
    else {
      await User.create({ name, email, password });

      res.status(201).json({ message: "successfully create user" })
    }
  }
  catch (err) {
    res.status(500).json(err);
  };
}


exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // const email=req.body.email;
    // const password=req.body.password;
    const result = await User.findOne({ where: { email: email } })
    if (result) {
      if (result.password === password) {
        res.status(201).json({ message: 'Successfully login' });
      }
      else {
        res.status(400).json({ message: 'Password Wrong' })
      }
    }
    else {
      res.status(404).json({ message: 'Email doesn"t exist' });
    }
  }
  catch (err) {
    res.status(500).json(err);
  };
}