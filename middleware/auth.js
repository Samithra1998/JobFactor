import { UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const Auth = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authorization failed");
  }

  const token = authHeaders.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    console.log(payload);
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authorization failed!");
  }
};

export default Auth;
