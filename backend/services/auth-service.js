const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const path = require('path');
const { Permissions } = require('../models/authentication/permissions-model');
const imageThumbnail = require('image-thumbnail');

const signJWT = (req, res) => {
    const user = req.user;
    jwt.sign(
        {
            userId: user._id,
            residence: user.residence,
            role: user.role
        },
        keys.JWT.secretKey,
        {
            algorithm: keys.JWT.algorithms[0],
            expiresIn: keys.JWT.expiry
        },
    async (err, token) => {
        if (err) {
            res.sendStatus(500);
        } else {
            // Send default profile pic unless one exists
            let profilePicPath = path.resolve(path.join(__dirname,'../defaults/avatar.png')); 
            if (user.profilePicPath) {
                profilePicPath = path.resolve(user.profilePicPath);
            }
            const profilePic = await imageThumbnail(profilePicPath, {percentage: 100, responseType:'base64'});

            res.status(200).send({
                name: user.name,
                role: user.role,
                token: token,
                profilePic: profilePic
            });
        }
    });
}

const isPermitted = async (role, category, action) => {
    return await Permissions.findOne({role: role})
    .then(doc => {
        return doc.get(category + "." + action);
    }).catch(err => {
        console.log(err);
        return false;
    });
}

//Todo refreshing of tokens

module.exports = {signJWT, isPermitted};