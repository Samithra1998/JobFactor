import Jobs from "../models/Job.js";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";
import moment from "moment";

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all inputs!");
  }

  req.body.createdBy = req.user.userId;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Jobs.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No Job with Id: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);
  await job.deleteOne();
  res.status(StatusCodes.CREATED).json({ msg: "Job deleted Successfully!" });
};

const getAllJobs = async (req, res) => {
  const { status, jobType, search, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let result = Jobs.find(queryObject);

  //chain of sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const jobs = await result;

  const totalJobs = await Jobs.countDocuments(queryObject);
  const noOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.CREATED).json({ jobs, totalJobs, noOfPages });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const { company, position } = req.body;
  if (!position || !company) {
    throw new BadRequestError("Please provide all inputs!");
  }

  const job = await Jobs.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with ${jobId}`);
  }
  console.log(typeof req.user.userId);
  console.log(typeof job.createdBy);

  checkPermissions(req.user, job.createdBy);

  const updateJob = await Jobs.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.CREATED).json({ updateJob });
};

const showStats = async (req, res) => {
  let stats = await Jobs.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) },
    },
    {
      $group: { _id: "$status", total: { $sum: 1 } },
    },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, total } = curr;
    acc[title] = total;
    return acc;
  }, {});

  const defaultStats = {
    interview: stats.interview || 0,
    pending: stats.pending || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Jobs.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.CREATED).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
