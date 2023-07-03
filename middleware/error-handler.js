import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err.message);
  const defaultError = {
    statuscode: err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something has wrong!",
  };
  if (err.name === "ValidationError") {
    defaultError.statuscode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  if (err.code && err.code === 11000) {
    defaultError.statuscode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique!`;
  }
  // res.status(500).json({ msg: err});
  res.status(defaultError.statuscode).json({ msg: defaultError.msg });
  console.log(defaultError.msg);
};

export default errorHandlerMiddleware;
