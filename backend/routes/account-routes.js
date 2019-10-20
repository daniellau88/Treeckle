const router = require('express').Router();
const multer = require('multer');
const constants = require('../config/constants');
const path = require('path');
const { isPermitted } = require('../services/auth-service');
const User = require('../models/authentication/user-model');

const storage = multer.diskStorage({
    destination: 'uploads/profilePictures',
    filename: function (req, file, cb) {
      cb(null, req.user.userId + path.extname(file.originalname));
    }
  })

const upload = multer({ storage: storage, limits: {fileSize: constants.profilePicSizeLimit} });

router.put('/profilePicture', upload.single('profilePicture'), async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.accountsSelf, constants.actions.update);

    if (!permitted) {
        res.sendStatus(401);
    } else if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
        console.log(req.file.mimetype);
        res.sendStatus(400);
    } else {
        User.findByIdAndUpdate(req.user.userId, {profilePicPath: req.file.path}, {new: true})
        .then(async doc => {
            const profilePicPath = path.resolve(doc.profilePicPath);
            res.sendFile(profilePicPath);
        })
        .catch(err => {
            res.sendStatus(500);
        })
    }
});

module.exports = router;