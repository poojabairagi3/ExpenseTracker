const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const User = require("../models/user");
const Forgotpassword = require("../models/password");

const forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email: email },
    });
    // console.log(user);
    if (user) {
      const id = uuid.v4();
      await Forgotpassword.create({
        id,
        active: true,
        userId:user.id
      });

      //sending mail
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;
      const transactionalEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "poojabairagi0301@gmail.com",
        name: "Pooja Bairagi",
      };

      const receivers = [
        {
          email: req.body.email,
        },
      ];

      await transactionalEmailApi
        .sendTransacEmail({
          sender,
          to: receivers ,
          subject: "Reset Password to Expense Tracker",
          htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Click Here</a> for resetting password`,
        })
        .then(console.log)
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(404).json({ message: "USER NOT FOUND" });
    }
  }
   catch (err) {
    // console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

const resetpassword = async (req, res, next) => {
  const id = req.params.id;
  const forgotpasswordrequest = await Forgotpassword.findOne({
    where: { id },
  });

  if (forgotpasswordrequest) {
   
    res.status(200).send(`<html>
                            <script>
                              function formsubmitted(e){
                              e.preventDefault();
                              console.log('called')
                              }
                            </script>
                            <form action='http://localhost:3000/password/updatepassword/${id}' method="get">
                            <label for="newpassword">Enter New password</label>
                            <input name="newpassword" type="password" required></input>
                            <button>reset password</button>
                            </form>
                          </html>`);
    res.end();
  } else {
    res.status(404).send(`<html>
                            <h1>Page Has expired</h1>
                          </html>`);
    res.end();
  }
};

const updatepassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const resetPasswordId = req.params.resetpasswordid;
    const resetPasswordRequest = await Forgotpassword.findOne({
      where: { id: resetPasswordId },
    });
    if (resetPasswordRequest) {
      const user = await User.findOne({
        where: { id: resetPasswordRequest.userId },
      });
      if (user) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            await user.update({ password: hash });
            await resetPasswordRequest.update({ active: false });

            res.status(200).json({ message: "Password Reset Successfully " });
          });
        });
      } else {
        return res.status(404).json({ message: "No user Exists" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err, message: "Something went wrong" });
  }
};


module.exports = { forgotpassword, resetpassword, updatepassword };