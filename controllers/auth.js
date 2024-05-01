const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  console.log("in auth.register:");
  console.log("req.body:  ", req.body);

  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  console.log("token created: ",token)
  console.log("\nreq.body:  ", req.body);

  res.status(StatusCodes.CREATED).json({ user: { name: user.name},token });

  console.log(`in auth.register => user object:\n${user}`);
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide password, and email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

  
    const token = user.createJWT();
    // console.log("userId ", user._id, user.name);
    res
      .status(StatusCodes.OK)
      .json(
        {user: {
          name:user.name,
        },
        token,
  });
  } catch (err) {
    console.error("Error during login", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = {
  register,
  login,
};
