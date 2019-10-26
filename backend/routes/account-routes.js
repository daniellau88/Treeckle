const router = require('express').Router();
const multer = require('multer');
const constants = require('../config/constants');
const imageThumbnail = require('image-thumbnail');
const { isPermitted } = require('../services/auth-service');
const User = require('../models/authentication/user-model');
const CreateAccount = require('../models/authentication/createAccount-model');
const upload = multer({ limits: {fileSize: constants.profilePicSizeLimit} });
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Resident & above: Update profile picture
router.put('/profilePicture', upload.single('profilePicture'), async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.accountsSelf, constants.actions.update);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!req.file || (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png')) {
        res.sendStatus(400);
    } else {
        const profilePic = await imageThumbnail(req.file.buffer, { width: 300, height: 300, responseType:'buffer'});
        User.findByIdAndUpdate(req.user.userId, {profilePic: profilePic}, {new: true})
        .then(doc => {
            res.send(doc.profilePic);
        })
        .catch(err => {
            res.sendStatus(500);
        })
    }
});

//Admin: Get all pending and created users under their RC
router.get('/', async (req, res) => {
    const permittedOne = await isPermitted(req.user.role, constants.categories.accountCreationRequest, constants.actions.read);
    const permittedTwo = await isPermitted(req.user.role, constants.categories.accountsAll, constants.actions.read);

    if (!permittedOne || !permittedTwo) {
        res.sendStatus(401);
    } else {
        try {
            let created = [];
            let pending = [];
            const createdDocuments = await User.find({residence: req.user.residence}).lean();
            const pendingDocuments = await CreateAccount.find({residence: req.user.residence}).lean();

            for (createdDocument of createdDocuments) {
                if (req.user.userId != createdDocument._id) {
                    created.push({
                        name: createdDocument.name,
                        email: createdDocument.email,
                        role: createdDocument.role
                    });
                }
            }

            for (pendingDocument of pendingDocuments) {
                pending.push({
                    name: "",
                    email: pendingDocument.email,
                    role: pendingDocument.role
                });
            }
            res.send({
                createdAccounts: created,
                pendingAccounts: pending
            });
        } catch(err) {
            res.sendStatus(500);
        }
    }
});

//Admin: update specific created user or all pending requests under their RC - emails updates commented out
router.patch('/', jsonParser, [
    body('email').exists().isEmail(),
    body('name').optional().isString(),
    body('role').optional().isString().isIn(Object.values(constants.roles))
], async (req, res) => {
    const errors = validationResult(req);
    const permittedOne = await isPermitted(req.user.role, constants.categories.accountCreationRequest, constants.actions.update);
    const permittedTwo = await isPermitted(req.user.role, constants.categories.accountsAll, constants.actions.update);

    if (!permittedOne || !permittedTwo) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        try {
            await User.updateOne({ email: req.body.email, _id : { $ne : req.user.userId }},
                {
                    //email: req.body.email,
                    name: req.body.name,
                    role: req.body.role
                }, 
                {omitUndefined: true}).lean();
            
            await CreateAccount.updateMany({ email: req.body.email },
                {
                    //email: req.body.email,
                    role: req.body.role
                },
                {omitUndefined: true}).lean();       
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    }
});

//Admin: delete specific created user or all pending requests for that user under under their RC
router.delete('/', jsonParser, [
    body('email').exists().isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    const permittedOne = await isPermitted(req.user.role, constants.categories.accountCreationRequest, constants.actions.delete);
    const permittedTwo = await isPermitted(req.user.role, constants.categories.accountsAll, constants.actions.delete);

    if (!permittedOne || !permittedTwo) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        try {
            await User.deleteOne({ email: req.body.email, _id : { $ne : req.user.userId }}).lean();
            await CreateAccount.deleteMany({ email: req.body.email }).lean();
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    }
});

module.exports = router;