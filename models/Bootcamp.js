const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const options = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, `Name Can't be more than 50 charecters`],
    },

    slug: String,

    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, `Description Can't be more than 500 charecters`],
    },

    website: {
      type: String,
      match: [
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },

    phone: {
      type: String,
      maxlength: [20, `Description Can't be more than 20 charecters`],
    },

    email: {
      type: String,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gm,
        "Please add a valid email",
      ],
    },

    address: {
      type: String,
      required: [true, "Please add an address"],
    },

    location: {
      //GeoJSON point
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        //   required: true
      },
      coordinates: {
        type: [Number],
        //   required: true,
        index: "2dsphere", //index on the coordinate of a 2D sphere
      },
      //we can add other fields we'll get from MapQuest API, GeoCoder
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },

    careers: {
      //Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Others",
      ],
    },

    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, `Rating can't be more than 10`],
    },

    averageCost: Number,

    photo: {
      type: String,
      default: "no-photo.jpeg",
    },

    housing: {
      type: Boolean,
      default: false,
    },

    jobAssistance: {
      type: Boolean,
      default: false,
    },

    jobGuarantee: {
      type: Boolean,
      default: false,
    },

    acceptGi: {
      //Gi bill accepts ot not
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { options }
);

BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false
});

//Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocoder and create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    //require
    type: "point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    //others
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //do not save the address in DB
  this.address = undefined;

  next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
