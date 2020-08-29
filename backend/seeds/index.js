const mongoose = require("mongoose");
const keys = require("../config/keys");
const {
  configurePermissions
} = require("../models/authentication/permissions-model");
const { seedUsers, seedRooms } = require('./rc4-seed');

//Connect to DB
mongoose.connect(
  keys.database.devDatabaseURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  err => {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected to mongoDB");
      Promise.all([configurePermissions(), seedUsers().then(() => seedRooms())]).finally(() => {
        mongoose.connection.close();
      });
    }
  }
);
