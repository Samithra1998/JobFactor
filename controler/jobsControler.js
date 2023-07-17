import Jobs from "../models/Job.js";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all inputs!");
  }

  req.body.createdBy = req.user.userId;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json({job});
};

const deleteJob = async (req, res) => {
  res.send("Job Deleted");
};

const getAllJobs = async (req, res) => {
  res.send("Fetching jobs");
};

const updateJob = async (req, res) => {
  res.send("Job updated");
};

const showStats = async (req, res) => {
  res.send("Showing stats");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
