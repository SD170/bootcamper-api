const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    // type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

//Static methhod to get Avg of all course price
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  //this -> the model itself

  try {
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId },
      },
      {
        $group: {
          _id: "$bootcamp",
          averageCost: {
            $avg: "$tuition",
          },
        },
      },
    ]);

    const data = await this.model("Bootcamp").findOneAndUpdate(
      { _id: bootcampId },
      { averageCost: Math.ceil(obj[0].averageCost / 10) * 10 }, //we do that so that we can get a Proper Int
      { runValidators: true, new: true }
    );

  } catch (err) {
    console.error(err);
    throw "May be an Error finding and updating bootcamp with this ID : " + err;
  }
};

//call getAvgCost after save
CourseSchema.post("save", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

//call getAvgCosr before remove
CourseSchema.pre("remove", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
