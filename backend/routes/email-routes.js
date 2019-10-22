const router = require('express').Router();
const constants = require('../config/constants');
const EmailReceiptsConfig = require('../models/emailReceiptsConfig-model');
const { body, validationResult } = require('express-validator');
const {isPermitted} = require('../services/auth-service');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Admin: get email to cc
router.get('/', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.emailReceiptsConfig, constants.actions.read);

    if (!permitted) {
        res.sendStatus(401);
    } else {
        EmailReceiptsConfig.byTenant(req.user.residence).findOne({}).lean()
        .then(result => {
            if (result) {
                res.send({
                    email: result.email
                });
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.status(500).send("Database Error");
        })
    }
})

//Admin: update email to cc
router.put('/', jsonParser, [
    body('email').exists().isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    const permittedOne = await isPermitted(req.user.role, constants.categories.emailReceiptsConfig, constants.actions.create);
    const permittedTwo = await isPermitted(req.user.role, constants.categories.emailReceiptsConfig, constants.actions.update);

    if (!permittedOne || !permittedTwo) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        EmailReceiptsConfig.byTenant(req.user.residence).findOneAndUpdate({}, {email: req.body.email}, { upsert: true })
        .then((result) => {
            if (!result) {
                res.sendStatus(201);
            } else {
                res.sendStatus(200);
            }
        })
        .catch(err => {
            res.status(500).send("Database Error");
        })
    }

})


module.exports = router;