const express = require('express');

//importing controller functions
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;