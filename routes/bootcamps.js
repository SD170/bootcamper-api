const express = require("express");

//importing controller functions
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
} = require("../controllers/bootcamps");

//include other resourse routers
const courseRouter = require('./courses');

const router = express.Router();

//re-route into other resourse routers 
router.use('/:bootcampId/courses', courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router.route("/").get(getBootcamps).post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
