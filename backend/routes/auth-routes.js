const router = require('express').Router();
const User = require('../models/authentication/user-model');
const CreateAccount = require('../models/authentication/createAccount-model');
const PasswordReset = require('../models/authentication/passwordReset-model');
const constants = require('../config/constants');
const authService = require('../services/auth-service');
const shortid = require('shortid');
const EmailService = require('../services/email-service');
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
        const relevantReq = await CreateAccount.findOne({ email: req.body.email, uniqueURIcomponent: req.body.uniqueURIcomponent});
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
            async err => {
                if (err) {
                    res.status(400).send({
                        message: "Invalid link."
                    });
                } else {
                    res.status(200).send({
                        message: "OK"
                    });
                await CreateAccount.deleteMany({email: req.body.email}).lean();
                }
            });
        }
    }
});

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
                EmailService.sendText(req.body.email, 'Account Creation for Treeckle',
                    `<p>Dear User, please proceed with account creation using the following link:</p>
                    <p>${constants.baseURI}/${constants.createURI}/${id}</p>
                    <p>We look forward to having you in our community!</p>
                    <p>Yours Sincerely,\n Treeckle Team</p>`)
                .then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(503);
                });
            }
        });
    }
});

//Reset password for local account
router.post('/resetAttempt', jsonParser, [
  check('email').isEmail(),
  check('uniqueURIcomponent').exists(),
  check('password').isLength({ min: 8 })
], async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const currTime = Date.now();

        try {
            //Update link expiry to current time
            const doc = await PasswordReset.findOneAndUpdate({email: req.body.email, uniqueURIcomponent: req.body.uniqueURIcomponent}, {expiry: currTime}).lean();
            
            if (!doc || doc.expiry <= currTime) {
                res.status(500).send("Invalid Link.");
            } else {
                const user = await User.findOne({email: doc.email});
                const modifiedUser = await user.setPassword(req.body.password);
                await modifiedUser.save();
                res.sendStatus(200);
            }
        } catch(err) {
            res.status(500).send("Database Error");
        }
    }
});


//Reset password request
router.post('/resetAccount', jsonParser, [
    check('email').isEmail(),
], async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

    //Find user within database
    const userFound = await User.findByUsername(req.body.email, false).catch(error => res.status(500).send("Database Error"));

    if (!userFound) {
        res.sendStatus(200);
    } else {
        //Generate cryptic URI
        const uniqueURIcomponent = shortid.generate();

        //Save reset request
        await PasswordReset.findOneAndUpdate({email: req.body.email}, {
            email : req.body.email,
            uniqueURIcomponent: uniqueURIcomponent,
            expiry: Date.now() + (3600 * 1000) //Link valid for one hour
        }, {upsert: true}).lean()
        .then(result => res.sendStatus(200))
        .catch(error => res.status(500).send("Database Error"));

        //Send email to user
        await EmailService.sendText(req.body.email, 'Password Reset for Treeckle', 
            `<p>Dear User,</p>
            <p>We have received a request to reset your password.</p>
            <p>Click <a href="${constants.baseURI}/${constants.resetURI}/${uniqueURIcomponent}">here</a> to reset your password</p>
            <br>
            <p>If this request was not initiated by you, kindly ignore this email.</p>
            <p>Yours Sincerely,</p>
            <p>Treeckle Team</p>`);
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

module.exports = router;