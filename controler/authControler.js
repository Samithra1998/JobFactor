import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {BadRequestError} from '../errors/index.js'

const register = async (req, res) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password) {
        throw new BadRequestError('Please provide all inputs')
    }

    const isUserExist = await User.findOne({email});
    if(isUserExist) {
      throw new BadRequestError('User already exist!')
    }
  const user = await User.create({name,email,password});
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({user: {email:user.email,name:user.name,lastName:user.lastName,location:user.location},token,location:user.location});
};

const login = async (req, res) => {
  res.send("Login user");
};

const updateUser = async (req, res) => {
  res.send("Update user");
};

export { register, login, updateUser };
