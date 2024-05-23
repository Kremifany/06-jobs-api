const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  console.log(req.user, req.params);
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new BadRequestError("Invalid job id");
  }
  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id :  ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  console.log(req.user, req.params);
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (!company || !position) {
    throw new BadRequestError("Company or position fields cannot be empty");
  }
  if (!mongoose.isValidObjectId(jobId)) {
    throw new BadRequestError("Invalid job id");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id :  ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  console.log(req.user, req.params);
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new BadRequestError("Invalid job id");
  }
  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id :  ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};
module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
