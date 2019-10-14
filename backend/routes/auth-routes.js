const router = require('express').Router();
const User = require('../models/user-model');
const CreateAccount = require('../models/createAccount-model');
const authService = require('../services/auth-service');
const shortid = require('shortid');
const EmailService = require('../services/email-service');
const constants = require('../config/constants');
const bodyParser = require('body-parser');
const passport = require("passport");
const { check, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

//Registration of new local account
router.post("/newAccounts", jsonParser, [
    check('name').exists().isLength({ min: 1 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
    check('uniqueURIcomponent').exists()
], async (req, res) => {  
    //Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const relevantReq = await CreateAccount.findOne({ email: req.body.email, uniqueURIcomponent: req.body.uniqueURIcomponent}).lean();
        if (!relevantReq) {
            res.status(400).send({
                message: "Invalid link."
            });
        } else {
            //Attempt to register user
            User.register(new User({
                email: req.body.email,
                name: req.body.name,
                permissionLevel: 0,
                participatedEventIds: [],
                subscribedCategories: [],
                profilePicPath: "" //To modify once created
            }),
            req.body.password,
            err => {
                if (err) {
                    res.status(400).send({
                        message: "Invalid link."
                    });
                } else {
                    res.status(200).send({
                    message: "OK"
                });
                }
            });
        }
    }
});

// Login as new user
router.post('/accounts',
    jsonParser,
    passport.authenticate('local', { session: false }),
    (req, res) => {
        authService.signJWT(req, res);
    }
);

//Account creation request
router.post('/newAccountRequest', passport.authenticate('jwt', { session: false }), jsonParser, [
    check('email').isEmail(),
], (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else if (req.user.permissionLevel < constants.permissionLevels.Admin) {
        res.status(401).send("Insufficient permissions")
    } else {
        //Generate a shortid
        const id = shortid.generate();
        //Create a new Database entry for account creation
        new CreateAccount({
            email: req.body.email,
            uniqueURIcomponent: id
        }).save((err, product) => {
            if (err) {
                    res.status(500).send("Database Error");
            } else {
                EmailService.sendText(req.body.email, 'Account Creation for Treeckle', `Dear User, please proceed with account creation using the following link:\n 
                https://treeckle.com/auth/newAccounts/${id}\n
                \n We look forward to having you in our community!\n
                Yours Sincerely,\n
                Treeckle Team`)
                .then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(503);
                });
            }
        });
    }
});

module.exports = router;