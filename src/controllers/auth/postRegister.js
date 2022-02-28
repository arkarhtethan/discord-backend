const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, password, mail } = req.body;
    const userExists = await User.exists({ mail: mail.toLowerCase() });
    if (userExists) {
      return res.status(409).send("E-mail address already in use.");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });
    const token = jwt.sign({ userId: user._id, mail }, process.env.JWT_SECRET);
    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occur. Please try again");
  }
};

module.exports = postRegister;
