const errorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//  @desc       get all courses
//  @route      GET /api/v1/courses
//  @route      GET /api/v1/bootcamps/:bootcampId/courses
//  @access     Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  //check if there's a bootcampId
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate("bootcamp", "name description averageCost");
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//  @desc       get a single course
//  @route      GET /api/v1/courses/:id
//  @access     Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  let query;

  query = Course.findById(req.params.id).populate("bootcamp","name description");

  const courseRes = await query;

  if(!courseRes){
    return next(new ErrorResponse(`No Course with the id of ${req.params.id}`,404));
  }

  res.status(200).json({
    success: true,
    data: courseRes,
  });
});

//  @desc       Add a course
//  @route      POST /api/v1/bootcamps/:bootcampId/courses
//  @access     Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  //bootcampId is in params
  req.body.bootcamp=req.params.bootcampId;

  //checking if the bootcamp exists or not
  const bootcampRes = await Bootcamp.findById(req.params.bootcampId);
  if(!bootcampRes){
    return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`,404));
  }

  const courseRes = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: courseRes,
  });
});
