const express = require("express");
const path = require('path');
const multer = require("multer");
const ErrorResponse = require("../utils/errorResponse");

//importing controller functions
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

//include other resourse routers
const courseRouter = require("./courses");

const router = express.Router();

//creating filestorage for multer

const fileStorageEngine = multer.diskStorage({
  destination: (req, fle, cb) => {
    cb(null, path.join(process.env.FILE_UPLOAD_PATH,"images"));
  },
  filename: (req, file, cb) => {
    /*we wnt only 1 image with 1 bootcamp, uploading an image again will replace the previous image.
    If we would've wanted to keep previous images, we could've used a Date.now() in filename */
    cb(null, file.fieldname + "-" + req.params.id + "-" + file.originalname);
  },
});

//multer middleware create
const upload = multer({
  storage: fileStorageEngine,
  limits: {
    fileSize: Number(process.env.FILE_UPLOAD_MAX_SIZE) || 2000000, //2MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image")) {
      // all image type starts with image, be it jpg, png or other
      return cb(null, false, cb(new ErrorResponse("MIMEtype mismatch", 400)));
    }
    cb(null, true);
  },
}).single("file"); //important: image is the input name

//re-route into other resourse routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router.route("/").get(getBootcamps).post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router
  .use("/:id/photo", upload) //adding multer middleware
  .route("/:id/photo")
  .put(bootcampPhotoUpload);

module.exports = router;
