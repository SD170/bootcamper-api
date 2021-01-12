const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

//load env vars
dotenv.config({path: './config/config.env'});

//Connect to database
connectDB();

//route files
const bootcamps = require('./routes/bootcamps');

const app = express();

//dev logging middleware
if(process.env.NODE_ENV==='development'){   //only when using dev env
    app.use(morgan('dev'));
}

//mount routers
app.use('/api/v1/bootcamps',bootcamps);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//handle unhandled PromeseRejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    
    //Close Server & exit process
    server.close(()=> process.exit(1));
})

