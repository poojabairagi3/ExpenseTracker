const User = require('../models/user');
const bcrypt=require('bcrypt');

exports.postUser = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;
    console.log(name, email, password);
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(201).json({ err: "email already exits" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      console.log(hashPassword);
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


exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
      where: { email: email }
    });
    if (user) {
      bcrypt.compare(password, user.password,(err,result)=>{
        if(err){
          return res.status(500).json({ message: "something went wrong" });
        }
        if(result===true){
          return res.status(201).json({ msg: "login successfully" });
        }
        else {
          return res.status(400).json({ msg: "Password incorrect" });
        }
      });
        
    } else{
      return res.status(404).json({ msg: "user not exist" });
    }
  }
  catch (err) {
    res.status(500).json(err);
  };
}