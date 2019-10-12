const express = require('express');
const mongoose = require('mongoose');

const keys = require('./config/keys');

const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const authRoutes = require('./routes/auth-routes');

const app = express();
const path = require('path');
const port = 3000;

//Initialize
app.use(passport.initialize());

//Connect to DB
mongoose.connect(
    keys.database.devDatabaseURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => {
        console.log("Connected to mongoDB");
    }
);

//Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname,'../frontend/build/index.html')));

app.use(express.static(path.join(__dirname,"../frontend/build")));

//Catch GET requests to invalid URIs and redirect to home page
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });

app.listen(port, () => console.log(`Application running on port ${port}!`)) 