const router = require("express").Router();
const multer = require("multer");
const constants = require("../config/constants");
const imageThumbnail = require("image-thumbnail");
const { isPermitted } = require("../services/auth-service");
const User = require("../models/authentication/user-model");
const CreateAccount = require("../models/authentication/createAccount-model");
const upload = multer({ limits: { fileSize: constants.profilePicSizeLimit } });
const { body, query, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

//Resident & above: Update profile picture
router.put(
  "/profilePicture",
  upload.single("profilePicture"),
  async (req, res) => {
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.accounts,
      constants.actions.updateSelf
    );

    if (!permitted) {
      res.sendStatus(401);
    } else if (
      !req.file ||
      (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png")
    ) {
      res.sendStatus(400);
    } else {
      const profilePic = await imageThumbnail(req.file.buffer, {
        width: 300,
        height: 300,
        responseType: "buffer"
      });
      User.findByIdAndUpdate(
        req.user.userId,
        { profilePic: profilePic },
        { new: true }
      )
        .then(doc => {
          res.send(doc.profilePic);
        })
        .catch(err => {
          res.sendStatus(500);
        });
    }
  }
);

//Resident & above: Update display name
router.patch(
  "/profileName",
  jsonParser,
  [
    body("newName")
      .exists()
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.accounts,
      constants.actions.updateSelf
    );

    if (!permitted) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      User.findByIdAndUpdate(
        req.user.userId,
        { name: req.body.newName },
        { new: true }
      )
        .then(doc => {
          res.json(doc.name);
        })
        .catch(err => {
          res.sendStatus(500);
        });
    }
  }
);

//Admin: Get all pending and created users under their RC
router.get(
  "/",
  [
    query("pending")
      .optional()
      .isBoolean()
      .toBoolean(),
    query("created")
      .optional()
      .isBoolean()
      .toBoolean()
  ],
  async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);

    const pending = req.query.pending == undefined ? true : req.query.pending;
    const created = req.query.created == undefined ? true : req.query.created;

    const permittedOne = pending
      ? await isPermitted(
          req.user.role,
          constants.categories.accountCreationRequest,
          constants.actions.read
        )
      : true;
    const permittedTwo = created
      ? await isPermitted(
          req.user.role,
          constants.categories.accounts,
          constants.actions.read
        )
      : true;

    if (!permittedOne || !permittedTwo) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      try {
        let results = [];

        if (pending) {
          const pendingDocuments = await CreateAccount.find(
            { residence: req.user.residence },
            "name email role"
          ).lean();

          for (pendingDocument of pendingDocuments) {
            results.push({
              name: "",
              email: pendingDocument.email,
              role: pendingDocument.role
            });
          }
        }

        if (created) {
          const createdDocuments = await User.find(
            { residence: req.user.residence },
            "name email role"
          ).lean();

          for (createdDocument of createdDocuments) {
            if (req.user.userId != createdDocument._id) {
              results.push({
                name: createdDocument.name,
                email: createdDocument.email,
                role: createdDocument.role
              });
            }
          }
        }

        results.sort((a, b) => {
          const emailA = a.email.toUpperCase();
          const emailB = b.email.toUpperCase();

          if (emailA < emailB) {
            return -1;
          } else if (emailA > emailB) {
            return 1;
          } else {
            return 0;
          }
        });

        results.sort(
          (a, b) =>
            constants.roleSortPriority[b.role] -
            constants.roleSortPriority[a.role]
        );

        res.send(results);
      } catch (err) {
        res.status(500).send("Database Error");
      }
    }
  }
);

//Admin: update specific created user or all pending requests under their RC - emails updates uncommented out
router.patch(
  "/",
  jsonParser,
  [
    body("email")
      .exists()
      .isEmail(),
    body("name")
      .optional()
      .isString(),
    body("role")
      .optional()
      .isString()
      .isIn(Object.values(constants.roles))
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const permittedOne = await isPermitted(
      req.user.role,
      constants.categories.accountCreationRequest,
      constants.actions.update
    );
    const permittedTwo = await isPermitted(
      req.user.role,
      constants.categories.accounts,
      constants.actions.update
    );

    if (!permittedOne || !permittedTwo) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      try {
        await User.updateOne(
          { email: req.body.email, _id: { $ne: req.user.userId } },
          {
            email: req.body.email, //comment this out to prevent email updates
            name: req.body.name,
            role: req.body.role
          },
          { omitUndefined: true }
        ).lean();

        await CreateAccount.updateMany(
          { email: req.body.email },
          {
            email: req.body.email, //comment this out to prevent email updates
            role: req.body.role
          },
          { omitUndefined: true }
        ).lean();
        res.sendStatus(200);
      } catch (err) {
        res.sendStatus(500);
      }
    }
  }
);

//Admin: update email(s) of specific created user or all pending requests
router.patch(
  "/userEmail",
  jsonParser,
  [
    body("currentEmail")
      .exists()
      .isEmail(),
    body("newEmail")
      .exists()
      .isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const permittedOne = await isPermitted(
      req.user.role,
      constants.categories.accountCreationRequest,
      constants.actions.update
    );
    const permittedTwo = await isPermitted(
      req.user.role,
      constants.categories.accounts,
      constants.actions.update
    );

    if (!permittedOne || !permittedTwo) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      try {
        await User.updateOne(
          { email: req.body.currentEmail, _id: { $ne: req.user.userId } },
          {
            email: req.body.newEmail //comment this out to prevent email updates
          },
          { omitUndefined: true }
        ).lean();

        await CreateAccount.updateMany(
          { email: req.body.currentEmail },
          {
            email: req.body.newEmail //comment this out to prevent email updates
          },
          { omitUndefined: true }
        ).lean();
        res.sendStatus(200);
      } catch (err) {
        res.sendStatus(500);
      }
    }
  }
);

//Admin: delete specific created user or all pending requests for that user under under their RC
router.delete(
  "/",
  jsonParser,
  [
    body("email")
      .exists()
      .isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const permittedOne = await isPermitted(
      req.user.role,
      constants.categories.accountCreationRequest,
      constants.actions.delete
    );
    const permittedTwo = await isPermitted(
      req.user.role,
      constants.categories.accounts,
      constants.actions.delete
    );

    if (!permittedOne || !permittedTwo) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      try {
        await User.deleteOne({
          email: req.body.email,
          _id: { $ne: req.user.userId }
        }).lean();
        await CreateAccount.deleteMany({ email: req.body.email }).lean();
        res.sendStatus(200);
      } catch (err) {
        res.sendStatus(500);
      }
    }
  }
);

module.exports = router;
