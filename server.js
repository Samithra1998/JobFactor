import "express-async-errors";
import express from "express";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import morgan from "morgan";
// import cors from 'cors';
// import bodyParser from "body-parser";
import authRoute from "./routes/authRoutes.js";
import jobsRoute from "./routes/jobsRoutes.js";
import authenticatedUser from "./middleware/auth.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(helmet())
app.use(cookieParser())
app.use(xss())
app.use(mongoSanitize())
app.use(express.static(path.resolve(__dirname, "./client/build")));
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());

app.route("/").get((req, res) => {
  // throw new Error("error");
  res.send("Welcome");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authenticatedUser, jobsRoute);

app.get((req,res) => {
  res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    connectDB(process.env.CONNECTION_STRING);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
