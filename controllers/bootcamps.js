//  @desc       get all bootcamps
//  @route      GET /api/v1/bootcamps
//  @access     Public
exports.getBootcamps = (req,res,next) =>{
    res.status(200).json({success:true,msg:"shows all bootcamps"});
}


//  @desc       get single bootcamp
//  @route      GET /api/v1/bootcamps/:id
//  @access     Public
exports.getBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:`shows bootcamp ${req.params.id}`});
}


//  @desc       Create a bootcamp
//  @route      POST /api/v1/bootcamps/
//  @access     Private
exports.createBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:"creates new bootcamp"});
}


//  @desc       update a bootcamp
//  @route      PUT /api/v1/bootcamps/:id
//  @access     Private
exports.updateBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:`updates bootcamp ${req.params.id}`});
}


//  @desc       delete a bootcamp
//  @route      DELETE /api/v1/bootcamps/:id
//  @access     Private
exports.deleteBootcamp = (req,res,next) =>{
    res.status(200).json({success:true,msg:`deletes bootcamp ${req.params.id}`});
}


