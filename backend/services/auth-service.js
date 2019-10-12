const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const path = require('path');
const imageThumbnail = require('image-thumbnail');

const signJWT = (req, res) => {
    const user = req.user;
    jwt.sign(
        {
            userId: user._id,
            permissionLevel: user.permissionLevel
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
            const profilePic = await imageThumbnail(profilePicPath, {percentage: 50, responseType:'base64'});

            res.status(200).send({
                name: user.name,
                permissionLevel: user.permissionLevel,
                token: token,
                profilePic: profilePic
            });
        }
    });
}

module.exports = {signJWT};