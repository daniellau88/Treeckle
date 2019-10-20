const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const path = require('path');
const { Permissions } = require('../models/authentication/permissions-model');

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
            res.status(200).send({
                name: user.name,
                role: user.role,
                token: token,
                profilePic: user.profilePic
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