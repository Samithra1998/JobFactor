import User from "../models/User.js";
import { BAD_GATEWAY, StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all inputs");
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new BadRequestError("User already exist!");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all inputs");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid credentials!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid credentials!");
  }
  const token = user.createJWT();
  user.password = undefined;
  res
    .status(StatusCodes.CREATED)
    .json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  res.send("Update user");
};

export { register, login, updateUser };
