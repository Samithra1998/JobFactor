import "express-async-errors";
import express from "express";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
// import cors from 'cors';
// import bodyParser from "body-parser";
import authRoute from "./routes/authRoutes.js";
import jobsRoute from "./routes/jobsRoutes.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
app.use(express.json());
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());

app.route("/").get((req, res) => {
  // throw new Error("error");
  res.send("Welcome");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", jobsRoute);

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
