const errorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

//  @desc       get all bootcamps
//  @route      GET /api/v1/bootcamps
//  @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude like select, sort etc
  const removeFields = ["select", "sort", "page", "limit"];

  // Delete removeFields from query
  removeFields.forEach((field) => delete reqQuery[field]);

  // Copy query string
  let queryString = JSON.stringify(reqQuery);

  // Create operators ($gt, $lt, $lte etc)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Bootcamp.find(JSON.parse(queryString));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

  // Pagination esult
  const pagination = {};

  if(endIndex<total){
    pagination.next = {
      page: page+1,
      limit:limit
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page:page-1,
      limit:limit
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination: pagination,
    data: bootcamps
  });
});

//  @desc       get single bootcamp
//  @route      GET /api/v1/bootcamps/:id
//  @access     Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//  @desc       Create a bootcamp
//  @route      POST /api/v1/bootcamps/
//  @access     Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//  @desc       update a bootcamp
//  @route      PUT /api/v1/bootcamps/:id
//  @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

//  @desc       delete a bootcamp
//  @route      DELETE /api/v1/bootcamps/:id
//  @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});

//  @desc       Get a bootcamp within a radius
//  @route      GET /api/v1/bootcamps/radius/:zipcode/:distance
//  @access     Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat and lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  console.log(loc);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Formula: Divide distance by radius of earth
  // Earth radius = 3963 mile / 6378 km

  const radius = Number(distance) / 3963;
  console.log(radius, Number(distance));

  //finding bootcamps
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  console.log("bootcamps", bootcamps);

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//old
//with try catch

// //  @desc       delete a bootcamp
// //  @route      DELETE /api/v1/bootcamps/:id
// //  @access     Private
// exports.deleteBootcamp = async (req, res, next) => {
//   try {
//     const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

//     if (!bootcamp) {
//       return next(new errorResponse (`Bootcamp not found with id of ${req.params.id}`, 404));
//     }

//     res.status(200).json({ success: true, data: {} });
//   } catch (err) {
//     next(err);
//   }
// };
