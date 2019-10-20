const router = require('express').Router();
const multer = require('multer');
const constants = require('../config/constants');
const imageThumbnail = require('image-thumbnail');
const { isPermitted } = require('../services/auth-service');
const User = require('../models/authentication/user-model');
const CreateAccount = require('../models/authentication/createAccount-model');
const upload = multer({ limits: {fileSize: constants.profilePicSizeLimit} });

router.put('/profilePicture', upload.single('profilePicture'), async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.accountsSelf, constants.actions.update);

    if (!permitted) {
        res.sendStatus(401);
    } else if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
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
})

module.exports = router;