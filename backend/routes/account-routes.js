const router = require('express').Router();
const multer = require('multer');
const constants = require('../config/constants');
const path = require('path');
const imageThumbnail = require('image-thumbnail');
const { isPermitted } = require('../services/auth-service');
const User = require('../models/authentication/user-model');
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

module.exports = router;