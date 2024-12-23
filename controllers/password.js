const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const User = require("../models/user");
const Forgotpassword = require("../models/password");

const forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      const expireby = new Date(Date.now() + 60 * 60 * 1000); // Set expiration to 1 hour from now

      // Create forgot password entry
      await Forgotpassword.create({
        id,
        active: true,
        userId: user.id,
        expiresby: expireby, // Fixed field name to match model
      });

      // Sending email
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;

      const transactionalEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: process.env.MAIN_EMAIL, // Change sender email as needed
        name: process.env.USER,
      };

      const receivers = [{ email }];

      try {
        await transactionalEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: "Reset Password for Expense Tracker",
          htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Click Here</a> to reset your password.`,
        });

        return res.status(200).json({ message: "Email sent successfully" });
      } catch (emailErr) {
        console.error("Email send error: ", emailErr);
        return res.status(500).json({ message: "Error sending email", error: emailErr.message });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error in forgotpassword:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

const resetpassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const forgotPasswordRequest = await Forgotpassword.findOne({
      where: { id },
    });

    if (forgotPasswordRequest) {
      const currentTime = new Date();
      if (forgotPasswordRequest.expiresby < currentTime) {
        return res.status(400).send(`
          <html>
            <h1>Reset link has expired</h1>
          </html>
        `);
      }

      return res.status(200).send(`
        <html>
          <form action="http://localhost:3000/password/updatepassword/${id}" method="POST">
            <label for="newpassword">Enter New Password</label>
            <input name="newpassword" type="password" required></input>
            <button type="submit">Reset Password</button>
          </form>
        </html>
      `);
    } else {
      return res.status(404).send(`
        <html>
          <h1>Invalid or expired reset link</h1>
        </html>
      `);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

const updatepassword = async (req, res, next) => {
  try {
    const { newpassword } = req.body; // Use req.body for POST requests
    const { resetpasswordid } = req.params;

    const resetPasswordRequest = await Forgotpassword.findOne({
      where: { id: resetpasswordid },
    });

    if (resetPasswordRequest) {
      const user = await User.findOne({
        where: { id: resetPasswordRequest.userId },
      });

      if (user) {
        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            console.error("Error generating salt: ", err);
            throw err;
          }

          bcrypt.hash(newpassword, salt, async (err, hash) => {
            if (err) {
              console.error("Error hashing password: ", err);
              throw err;
            }

            // Update user password and mark reset request as inactive
            await user.update({ password: hash });
            await resetPasswordRequest.update({ active: false });

            return res
              .status(200)
              .json({ message: "Password reset successfully" });
          });
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { forgotpassword, resetpassword, updatepassword };
