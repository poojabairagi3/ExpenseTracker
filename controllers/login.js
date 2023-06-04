exports.postLogin = async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password
      ) {
  
        return res.status(400).json({ err: "Bad parameters - Something is missing" })
      }
  
      const email = req.body.email;
      const password = req.body.password;
      const emailExist = await User.findOne({ where: { email: email } });
      const passwordExist = await User.findOne({ where: { password: password } });
      if (emailExist || passwordExist) {
        return res.status(201).json({ message: 'Login Successfully'});
      }
    }
  
    catch (err) {
      res.status(500).json(err);
    };
  }
  