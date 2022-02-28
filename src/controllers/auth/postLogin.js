const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
  try {
    const { password, mail } = req.body;
    const user = await User.findOne({ mail: mail.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user._id, mail },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          token,
          username: user.username,
        },
      });
    }
    res.status(400).send("Invalid credentials. Please try again.");
  } catch (error) {
    return res.status(500).send("Error occur. Please try again");
  }
};

module.exports = postLogin;
