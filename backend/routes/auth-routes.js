const router = require('express').Router();
const User = require('../models/authentication/user-model');
const CreateAccount = require('../models/authentication/createAccount-model');
const PasswordReset = require('../models/authentication/passwordReset-model');
const constants = require('../config/constants');
const keys = require('../config/keys');
const {isPermitted, signJWT} = require('../services/auth-service');
const fastCsv = require('fast-csv');
const path = require('path');
const validator = require('validator');
const shortid = require('shortid');
const EmailService = require('../services/email-service');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require("passport");
const { check, validationResult } = require('express-validator');
const imageThumbnail = require('image-thumbnail');

const storage = multer.diskStorage({
    destination: 'uploads/accountCreationCSV',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })

const upload = multer({ storage: storage });

const jsonParser = bodyParser.json();

//Temporary direct registration of new local account
router.post("/newAccountsDirect", jsonParser, [
    check('name').exists().isLength({ min: 1 }),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
], async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const profilePic = await imageThumbnail(path.resolve(path.join(__dirname, '../defaults/avatar.png')), { height:300, width:300, responseType:'buffer'});
            //Attempt to register user
            User.register(new User({
                email: req.body.email,
                name: req.body.name,
                role: constants.roles.Resident,
                residence: constants.residences.CAPT,
                participatedEventIds: [],
                subscribedCategories: [],
                profilePic: profilePic
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
);

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
            const profilePic = await imageThumbnail(path.resolve(path.join(__dirname, '../defaults/avatar.png')), { height:300, width:300, responseType:'buffer'});
            //Attempt to register user
            User.register(new User({
                email: req.body.email,
                name: req.body.name,
                role: relevantReq.role,
                residence: relevantReq.residence,
                participatedEventIds: [],
                subscribedCategories: [],
                profilePic: profilePic
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

//Admin: Account creation request
router.post('/newAccountRequest', passport.authenticate('jwt', { session: false }), jsonParser, [
    check('email').isEmail(),
], async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    const permitted = await isPermitted(req.user.role, constants.categories.accountCreationRequest, constants.actions.create);
    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        //Check if a registered user with the same email exists
        const userExists = await User.findOne({email: req.body.email}).lean();
        
        if (userExists) {
            res.sendStatus(400);
            return ;
        }

        //Generate a shortid
        const id = shortid.generate();

        //Get role or assign default
        let userRole = constants.roles.Resident;
        if (req.body.role && Object.values(constants.roles).includes(req.body.role)) {
            userRole = req.body.role;
        }
        
        //Create a new Database entry for account creation
        new CreateAccount({
            email: req.body.email,
            uniqueURIcomponent: id,
            residence: req.user.residence,
            role: userRole
        }).save((err, product) => {
            if (err) {
                    res.status(500).send("Database Error");
            } else {
                EmailService.sendText(req.body.email, 'Account Creation for Treeckle',
                    `<p>Dear User, please proceed with account creation using the following link:</p>
                    <p>${keys.baseURI}/${constants.createURI}/${id}</p>
                    <p>We look forward to having you in our community!</p>
                    <p>Yours Sincerely,</p>
                    <p>Treeckle Team</p>`)
                .then(() => {
                    res.sendStatus(200);
                }).catch(() => {
                    res.sendStatus(503);
                });
            }
        });
    }
});

//Admin: Bulk account creation requests through CSV file
router.post('/newAccountRequestCSV', passport.authenticate('jwt', { session: false }), upload.single('csvFile'), async (req, res) => {
    const acceptedRows = [];
    const rejectedRows = [];

    const permitted = await isPermitted(req.user.role, constants.categories.accountCreationRequest, constants.actions.create);

    if (!permitted) {
        res.sendStatus(401);
    } else {
        fastCsv.parseFile(req.file.path)
        .on("error", (err) => res.sendStatus(500))
        .on("data", (row) => {
            if (row.length === 2 && validator.isEmail(row[0]) && Object.values(constants.roles).includes(row[1])) {
                acceptedRows.push(row);
            } else {
                rejectedRows.push(row);
            }})
        .on("end", (rowCount) => {
            fastCsv.writeToPath(req.file.path, rejectedRows)
            .on("error", (err) => res.sendStatus(500))
            .on("finish", async () => {
                res.sendFile(path.resolve(req.file.path));
                const promisesExistence = [];
                const promises = [];
                
                for (let i = 0; i < acceptedRows.length; i++) {
                    promisesExistence.push(User.countDocuments({ email: acceptedRows[i][0]}).lean().exec());
                }

                try {
                    const results = await Promise.all(promisesExistence);

                    for (let i = 0; i < acceptedRows.length; i++) {
                        if (results[i] === 0) {
                            //Generate a shortid
                            const id = shortid.generate();

                            promises.push(CreateAccount({
                                email: acceptedRows[i][0],
                                uniqueURIcomponent: id,
                                residence: req.user.residence,
                                role: acceptedRows[i][1]
                            }).save());

                            promises.push(EmailService.sendText(acceptedRows[i][0], 'Account Creation for Treeckle',
                            `<p>Dear User, please proceed with account creation using the following link:</p>
                            <p>${keys.baseURI}/${constants.createURI}/${id}</p>
                            <p>We look forward to having you in our community!</p>
                            <p>Yours Sincerely,\n Treeckle Team</p>`));
                        }
                    }
                    await Promise.all(promises);
                } catch(err) {
                    console.log(err);
                }
            });
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
            <p>Click <a href="${keys.baseURI}/${constants.resetURI}/${uniqueURIcomponent}">here</a> to reset your password</p>
            <br>
            <p>If this request was not initiated by you, kindly ignore this email.</p>
            <p>Yours Sincerely,</p>
            <p>Treeckle Team</p>`);
    }
});

//Login as new user
router.post('/accounts',
    jsonParser,
    passport.authenticate('local', { session: false }),
    (req, res) => {
        signJWT(req, res);
    }
);

module.exports = router;