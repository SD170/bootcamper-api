const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongouser = process.env.MONGOUSER;
    const mongopassword = process.env.MONGOPASSWORD;
    const mongohost = process.env.MONGOHOST;
    const mongoport = process.env.MONGOPORT;
    const databasename = process.env.DATABASENAME;

    if (mongohost == "localhost") {
      let mongoString =
        "mongodb://" + mongohost + ":" + mongoport + "/" + databasename;
      const conn = await mongoose.connect(mongoString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log(
        `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
      );
    } else {
      let mongoString =
        "mongodb+srv://" +
        mongouser +
        ":" +
        encodeURIComponent(mongopassword) +
        "@" +
        mongohost +
        "/" +
        databasename +
        "?retryWrites=true&w=majority";

      //replica set needed in production | using standalone now
      //in eplica set:
      // mongoString =
      // "mongodb://" +
      // mongouser +
      // ":" +
      // encodeURIComponent(mongopassword) +
      // "@" +
      // mongohost +
      // ":" +
      // mongoport +
      // "/" +
      // databasename +
      // "?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";
      // mongoose
      // .connect(mongoString, {
      //     useNewUrlParser: true,
      //     useUnifiedTopology: true,
      //     useCreateIndex: true,
      //     useFindAndModify: false,
      //     ssl: true,
      //     sslValidate: false,
      //     sslCA: [fs.readFileSync("./private.pem")],
      // })
      // .then(() => console.log("Connection to DB successful"))
      // .catch((err) => console.error(err, "Error"));

      const conn = await mongoose.connect(mongoString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });

      console.log(
        `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
      );
    }
  } catch (err) {
    console.error(err, "Error".red.bold);
  }
};

module.exports = connectDB;
