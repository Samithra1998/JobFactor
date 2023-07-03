import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controler/jobsControler.js";

const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").delete(deleteJob).patch(updateJob);
router.route("/stats").get(showStats);

export default router;
