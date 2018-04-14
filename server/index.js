import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import mongoose from 'mongoose';
import router from './router';
import config from './config';
import session from 'express-session';
import fs from 'fs';

const app = express();


// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies and not extended amount of data
app.use(bodyParser.json()); // Send JSON responses

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'apiCall.log'), {flags: 'a'})
}))

mongoose.Promise = global.Promise;
const MongoStore = require("connect-mongo")(session);

// Database Setup
mongoose.connect(config.database, (mongooseErr) => {
  if(mongooseErr) {
    console.error(mongooseErr);
  }
  else {
    // session store Setup
    const sessionParameters = session({
      secret: config.secret,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      }),
      cookie: {
        path: "/",
        secure: true
      }
    });
    app.use(sessionParameters);

    // Import routes to be served
    router(app);
  }
});

const server =  app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});
console.log(`Your server is running on port ${config.port}.`);

// necessary for testing
module.exports = server;