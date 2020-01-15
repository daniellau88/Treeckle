const router = require("express").Router({ mergeParams: true });
const bodyParser = require("body-parser");
const RoomBooking = require("../../models/room-booking/roomBooking-model");
const User = require("../../models/authentication/user-model");
const Room = require("../../models/room-booking/rooms-model");
const EmailService = require("../../services/email-service");
const { isPermitted } = require("../../services/auth-service");
const mongoose = require("mongoose");
const constants = require("../../config/constants");
const {
  checkApprovedOverlaps,
  checkPotentialOverlaps,
  rejectOverlaps
} = require("../../services/booking-service");
const {
  sanitizeBody,
  sanitizeParam,
  param,
  body,
  query,
  validationResult
} = require("express-validator");

const jsonParser = bodyParser.json();

//Resident and up: Get an array of all roomBookings' made by requesting user
router.get("/", async (req, res) => {
  const permitted = await isPermitted(
    req.user.role,
    constants.categories.bookingRequestsManagement,
    constants.actions.readSelf
  );

  if (!permitted) {
    res.sendStatus(401);
  } else {
    RoomBooking.byTenant(req.user.residence)
      .find({ createdBy: req.user.userId }, null, { sort: { createdDate: -1 } })
      .lean()
      .then(async resp => {
        const idToRoom = new Map();
        const roomPromises = [];

        for (const response of resp) {
          if (!idToRoom.has(response.roomId.toString())) {
            roomPromises.push(Room.findById(response.roomId).lean());
            idToRoom.set(response.roomId.toString(), { roomName: null });
          }
        }

        try {
          const roomData = await Promise.all(roomPromises);

          roomData.forEach(roomDatum => {
            if (roomDatum) {
              idToRoom.set(roomDatum._id.toString(), {
                roomName: roomDatum.name
              });
            }
          });

          const sendToUser = [];
          resp.forEach(request => {
            sendToUser.push({
              bookingId: request._id,
              roomName: idToRoom.get(request.roomId.toString()).roomName,
              description: request.description,
              contactNumber: request.contactNumber,
              expectedAttendees: request.expectedAttendees,
              start: request.start.getTime(),
              end: request.end.getTime(),
              createdDate: request.createdDate.getTime(),
              comments: request.comments,
              approved: request.approved
            });
          });
          res.send(sendToUser);
        } catch (err) {
          res.status(500).send("Database Error");
        }
      })
      .catch(err => {
        res.status(500).send("Database Error");
      });
  }
});

//Admin: count pending requests
router.get("/all/count", async (req, res) => {
  const permitted = await isPermitted(
    req.user.role,
    constants.categories.bookingRequestsManagement,
    constants.actions.read
  );

  if (!permitted) {
    res.sendStatus(401);
    return;
  }

  RoomBooking.byTenant(req.user.residence)
    .countDocuments({ approved: constants.approvalStates.Pending })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

//Admin: retrieve all requests (paginated)
router.get(
  "/all",
  [
    query("page")
      .optional()
      .isInt()
      .toInt(),
    query("limit")
      .optional()
      .isInt()
      .toInt(),
    query(constants.approvalStatesStringMap[0])
      .optional()
      .isBoolean()
      .toBoolean(),
    query(constants.approvalStatesStringMap[1])
      .optional()
      .isBoolean()
      .toBoolean(),
    query(constants.approvalStatesStringMap[2])
      .optional()
      .isBoolean()
      .toBoolean(),
    query(constants.approvalStatesStringMap[3])
      .optional()
      .isBoolean()
      .toBoolean(),
    query("startDateOnwards")
      .optional()
      .isInt()
      .toInt(),
    query("sortOrder")
      .optional()
      .isIn([-1, 1])
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.bookingRequestsManagement,
      constants.actions.read
    );

    if (!permitted) {
      res.sendStatus(401);
      return;
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    let approvedStatusArray = Object.values(constants.approvalStatesStringMap);

    for (queryParamName of Object.keys(req.query)) {
      if (
        approvedStatusArray.includes(queryParamName) &&
        !req.query[queryParamName]
      ) {
        approvedStatusArray = approvedStatusArray.filter(elem => {
          return elem !== queryParamName;
        });
      }
    }

    const mappedStatus = approvedStatusArray.map(elem => {
      return constants.approvalStates[elem];
    });

    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    const startDateOnwards = req.query.startDateOnwards
      ? new Date(req.query.startDateOnwards)
      : new Date(0);
    const sortedBy = req.query.sortOrder
      ? { createdDate: req.query.sortOrder }
      : { createdDate: 1 };

    //Set up filter
    let filter = {};
    filter.approved = { $in: mappedStatus };
    filter.start = { $gte: startDateOnwards };

    const options = {
      page: page,
      limit: limit,
      sort: sortedBy,
      lean: true,
      leanWithId: true
    };

    RoomBooking.byTenant(req.user.residence)
      .paginate(filter, options)
      .then(async resp => {
        const idToUser = new Map();
        const idToRoom = new Map();
        const roomPromises = [];
        const userPromises = [];

        for (const response of resp.docs) {
          if (!idToUser.has(response.createdBy.toString())) {
            userPromises.push(
              User.findById(response.createdBy, { profilePic: 0 }).lean()
            );
            idToUser.set(response.createdBy.toString(), {
              name: null,
              email: null
            });
          }

          if (!idToRoom.has(response.roomId.toString())) {
            roomPromises.push(Room.findById(response.roomId).lean());
            idToRoom.set(response.roomId.toString(), { roomName: null });
          }
        }

        try {
          const mixedData = await Promise.all(
            [userPromises, roomPromises].map(Promise.all, Promise)
          );

          mixedData[0].forEach(userDatum => {
            if (userDatum) {
              idToUser.set(userDatum._id.toString(), {
                name: userDatum.name,
                email: userDatum.email
              });
            }
          });

          mixedData[1].forEach(roomDatum => {
            if (roomDatum) {
              idToRoom.set(roomDatum._id.toString(), {
                roomName: roomDatum.name
              });
            }
          });

          const sendToAdmin = {
            totalBookings: resp.totalDocs,
            totalPages: resp.totalPages,
            currentPage: resp.page,
            hasNextPage: resp.hasNextPage,
            nextPage: resp.nextPage,
            hasPreviousPage: resp.hasPrevPage,
            previousPage: resp.prevPage,
            bookings: []
          };

          resp.docs.forEach(request => {
            sendToAdmin.bookings.push({
              bookingId: request._id,
              roomName: idToRoom.get(request.roomId.toString()).roomName,
              description: request.description,
              contactNumber: request.contactNumber,
              expectedAttendees: request.expectedAttendees,
              start: request.start.getTime(),
              end: request.end.getTime(),
              createdByName: idToUser.get(request.createdBy.toString()).name,
              createdByEmail: idToUser.get(request.createdBy.toString()).email,
              createdDate: request.createdDate.getTime(),
              comments: request.comments,
              approved: request.approved
            });
          });
          res.send(sendToAdmin);
        } catch (err) {
          res.status(500).send("Database Error");
        }
      })
      .catch(err => {
        res.status(500).send("Database Error");
      });
  }
);

//Admin: Get conflicts that approval can cause
router.get("/manage/:id", async (req, res) => {
  const permitted = await isPermitted(
    req.user.role,
    constants.categories.bookingRequestsManagement,
    constants.actions.read
  );
  if (!permitted) {
    res.sendStatus(401);
  } else {
    RoomBooking.byTenant(req.user.residence)
      .findOne({ _id: req.params.id })
      .lean()
      .then(async relevantReq => {
        if (!relevantReq) {
          res.sendStatus(400);
        } else {
          const conflictDocs = await checkPotentialOverlaps(
            req,
            relevantReq.roomId,
            relevantReq.start,
            relevantReq.end
          );
          if (conflictDocs.error === 1) {
            res.status(500).send("Database Error");
          } else {
            const responseObject = conflictDocs.overlaps.filter(elem => {
              return elem.toString() !== relevantReq._id.toString();
            });
            res.send(responseObject);
          }
        }
      })
      .catch(err => {
        res.sendStatus(400);
      });
  }
});

//Resident and above: Cancel their own request from pending/approved state
router.patch("/", jsonParser, [body("id").exists()], async (req, res) => {
  const errors = validationResult(req);
  const permitted = await isPermitted(
    req.user.role,
    constants.categories.bookingRequestsManagement,
    constants.actions.updateSelf
  );
  if (!permitted) {
    res.sendStatus(401);
  } else if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    RoomBooking.byTenant(req.user.residence)
      .findOneAndUpdate(
        { _id: req.body.id, createdBy: req.user.userId },
        { approved: constants.approvalStates.Cancelled }
      )
      .lean()
      .then(async result => {
        if (result) {
          res.sendStatus(200);
          if (EmailService.isEmailRequired(result.end)) {
            const {
              userName,
              userEmail,
              roomName,
              carbonCopy
            } = await EmailService.getEmailDataForBR(
              req.user.userId,
              result.roomId,
              req.user.residence
            );

            EmailService.sendSwitcher(
              userName,
              userEmail,
              carbonCopy,
              `[${roomName}] Your booking request has been cancelled`,
              `<p>Dear ${userName}, you have initiated a cancellation of your booking request. Please refer to the details below.</p>
                         <br>
                         <p>Your contact: ${userName} / ${userEmail} / ${
                result.contactNumber
              }</p>
                         <p>Room name: ${roomName}</p>
                         <p>Expected number of attendees/participants: ${
                           result.expectedAttendees
                         }</p>
                         <p>Booked at: ${result.createdDate.toString()}</p>
                         <p>Start date/time: ${new Date(
                           result.start
                         ).toString()}</p>
                         <p>End date/time: ${new Date(
                           result.end
                         ).toString()}</p>
                         <p>Reason for booking: ${result.description}</p>
                         <p>Previous Status: ${
                           constants.approvalStatesStringMap[result.approved]
                         }</p>
                         <p>Current Status: ${
                           constants.approvalStatesStringMap[
                             constants.approvalStates.Cancelled
                           ]
                         }</p>
                         <br>
                         <p>Yours Sincerely,</p> 
                         <p>Treeckle Team</p>`
            );
          } else {
            res.sendStatus(403);
          }
        }
      })
      .catch(error =>
        error.name === "CastError"
          ? res.sendStatus(400)
          : res.status(500).send("Database Error")
      );
  }
});

//Admin: Patches the bookingRequest with approval or rejection, returns affected if approval
router.patch(
  "/manage",
  jsonParser,
  [
    body("id").exists(),
    body("approved")
      .exists()
      .isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.bookingRequestsManagement,
      constants.actions.update
    );

    if (!permitted) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else if (req.body.approved === constants.approvalStates.Approved) {
      RoomBooking.byTenant(req.user.residence)
        .findOne({
          _id: req.body.id,
          approved: { $ne: constants.approvalStates.Cancelled }
        })
        .lean()
        .then(async result => {
          if (!result) {
            res.sendStatus(403);
          } else {
            const conflictDocs = await rejectOverlaps(
              req,
              result.roomId,
              result.start,
              result.end
            );
            await RoomBooking.byTenant(req.user.residence)
              .findOneAndUpdate(
                {
                  _id: req.body.id,
                  approved: { $ne: constants.approvalStates.Cancelled }
                },
                { approved: constants.approvalStates.Approved }
              )
              .lean();
            if (conflictDocs.error === 1) {
              res.status(500).send("Database Error");
            } else {
              const responseObject = conflictDocs.overlaps.filter(elem => {
                return elem.toString() !== result._id.toString();
              });
              res.send(responseObject);

              //Send user approved email
              if (EmailService.isEmailRequired(result.end)) {
                try {
                  const affectedUser = await User.findOne({
                    _id: result.createdBy
                  }).lean();
                  const {
                    userName,
                    userEmail,
                    roomName,
                    carbonCopy
                  } = await EmailService.getEmailDataForBR(
                    affectedUser._id,
                    result.roomId,
                    affectedUser.residence
                  );

                  EmailService.sendSwitcher(
                    userName,
                    userEmail,
                    carbonCopy,
                    `[${roomName}] Your booking request has been updated`,
                    `<p>Dear ${userName}, an administrator has updated your booking request. Please refer to the details below.</p>
                                    <p>Your contact: ${userName} / ${userEmail} / ${
                      result.contactNumber
                    }</p>
                                    <p>Room name: ${roomName}</p>
                                    <p>Expected number of attendees/participants: ${
                                      result.expectedAttendees
                                    }</p>
                                    <p>Booked at: ${result.createdDate.toString()}</p>
                                    <p>Start date/time: ${new Date(
                                      result.start
                                    ).toString()}</p>
                                    <p>End date/time: ${new Date(
                                      result.end
                                    ).toString()}</p>
                                    <p>Reason for booking: ${
                                      result.description
                                    }</p>
                                    <p>Previous Status: ${
                                      constants.approvalStatesStringMap[
                                        result.approved
                                      ]
                                    } &raquo; <b>New Status: ${
                      constants.approvalStatesStringMap[
                        constants.approvalStates.Approved
                      ]
                    }</b></p>
                                    <br>
                                    <p>Yours Sincerely,</p> 
                                    <p>Treeckle Team</p>`
                  );

                  for (const component of responseObject) {
                    await EmailService.sendRejectionByRequestId(
                      component,
                      req.user.residence
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            }
          }
        })
        .catch(error =>
          error.name === "CastError"
            ? res.sendStatus(400)
            : res.status(500).send("Database Error")
        );
    } else if (req.body.approved === constants.approvalStates.Rejected) {
      RoomBooking.byTenant(req.user.residence)
        .findOneAndUpdate(
          {
            _id: req.body.id,
            approved: { $ne: constants.approvalStates.Cancelled }
          },
          { approved: constants.approvalStates.Rejected }
        )
        .lean()
        .then(async result => {
          if (result) {
            res.sendStatus(200);
            if (EmailService.isEmailRequired(result.end)) {
              try {
                const affectedUser = await User.findOne({
                  _id: result.createdBy
                }).lean();
                const {
                  userName,
                  userEmail,
                  roomName,
                  carbonCopy
                } = await EmailService.getEmailDataForBR(
                  affectedUser._id,
                  result.roomId,
                  affectedUser.residence
                );

                EmailService.sendSwitcher(
                  userName,
                  userEmail,
                  carbonCopy,
                  `[${roomName}] Your booking request has been updated`,
                  `<p>Dear ${userName}, an administrator has updated your booking request. Please refer to the details below.</p>
                                <p>Your contact: ${userName} / ${userEmail} / ${
                    result.contactNumber
                  }</p>
                                <p>Room name: ${roomName}</p>
                                <p>Expected number of attendees/participants: ${
                                  result.expectedAttendees
                                }</p>
                                <p>Booked at: ${result.createdDate.toString()}</p>
                                <p>Start date/time: ${new Date(
                                  result.start
                                ).toString()}</p>
                                <p>End date/time: ${new Date(
                                  result.end
                                ).toString()}</p>
                                <p>Reason for booking: ${result.description}</p>
                                <p>Previous Status: ${
                                  constants.approvalStatesStringMap[
                                    result.approved
                                  ]
                                } &raquo; <b>New Status: ${
                    constants.approvalStatesStringMap[
                      constants.approvalStates.Rejected
                    ]
                  }</b></p>
                                <br>
                                <p>Yours Sincerely,</p> 
                                <p>Treeckle Team</p>`
                );
              } catch (err) {
                console.log(err);
              }
            }
          } else {
            res.sendStatus(403);
          }
        })
        .catch(error =>
          error.name === "CastError"
            ? res.sendStatus(400)
            : res.status(500).send("Database Error")
        );
    } else if (req.body.approved === constants.approvalStates.Pending) {
      RoomBooking.byTenant(req.user.residence)
        .findOneAndUpdate(
          {
            _id: req.body.id,
            approved: { $ne: constants.approvalStates.Cancelled }
          },
          { approved: constants.approvalStates.Pending }
        )
        .lean()
        .then(async result => {
          if (result) {
            res.sendStatus(200);
            if (EmailService.isEmailRequired(result.end)) {
              try {
                const affectedUser = await User.findOne({
                  _id: result.createdBy
                }).lean();
                const {
                  userName,
                  userEmail,
                  roomName,
                  carbonCopy
                } = await EmailService.getEmailDataForBR(
                  affectedUser._id,
                  result.roomId,
                  affectedUser.residence
                );

                EmailService.sendSwitcher(
                  userName,
                  userEmail,
                  carbonCopy,
                  `[${roomName}] Your booking request has been updated`,
                  `<p>Dear ${userName}, an administrator has updated your booking request. Please refer to the details below.</p>
                                <p>Your contact: ${userName} / ${userEmail} / ${
                    result.contactNumber
                  }</p>
                                <p>Room name: ${roomName}</p>
                                <p>Expected number of attendees/participants: ${
                                  result.expectedAttendees
                                }</p>
                                <p>Booked at: ${result.createdDate.toString()}</p>
                                <p>Start date/time: ${new Date(
                                  result.start
                                ).toString()}</p>
                                <p>End date/time: ${new Date(
                                  result.end
                                ).toString()}</p>
                                <p>Reason for booking: ${result.description}</p>
                                <p>Previous Status: ${
                                  constants.approvalStatesStringMap[
                                    result.approved
                                  ]
                                } &raquo; <b>New Status: ${
                    constants.approvalStatesStringMap[
                      constants.approvalStates.Pending
                    ]
                  }</b></p>
                                <br>
                                <p>Yours Sincerely,</p> 
                                <p>Treeckle Team</p>`
                );
              } catch (err) {
                console.log(err);
              }
            }
          } else {
            res.sendStatus(403);
          }
        })
        .catch(error =>
          error.name === "CastError"
            ? res.sendStatus(400)
            : res.status(500).send("Database Error")
        );
    } else {
      res.sendStatus(403);
    }
  }
);

//Resident and up: Get an array of approved roomBookings' start-end intervals, within a specified range for a particular room
router.get(
  "/:roomId/:start-:end",
  [
    param("roomId").exists(),
    param("start")
      .exists()
      .isInt()
      .toInt(),
    param("end")
      .exists()
      .isInt()
      .toInt()
  ],
  sanitizeParam("roomId").customSanitizer(value => {
    return mongoose.Types.ObjectId(value);
  }),
  async (req, res) => {
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.bookingRequestsManagement,
      constants.actions.readSelf
    );
    //Check for input errors
    const { roomId, start, end } = req.params;
    const errors = validationResult(req);
    if (!permitted) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else if (start > end) {
      res.status(422).json({ ValueError: "start > end" });
    } else {
      responseObject = await checkApprovedOverlaps(req, roomId, start, end);

      if (responseObject.error === 1) {
        res.status(500).send("Database Error");
      } else {
        res.send(responseObject.overlaps);
      }
    }
  }
);

//Resident and up: Create a new bookingRequest
router.post(
  "/",
  jsonParser,
  [
    body("roomId").exists(),
    body("description").exists(),
    body("contactNumber").isInt(),
    body("expectedAttendees").isInt(),
    body("start")
      .exists()
      .isInt(),
    body("end")
      .exists()
      .isInt()
  ],
  sanitizeBody("roomId").customSanitizer(value => {
    return mongoose.Types.ObjectId(value);
  }),
  async (req, res) => {
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.bookingRequestsManagement,
      constants.actions.create
    );
    //Check for input errors
    const errors = validationResult(req);
    if (!permitted) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      //Check existence of room
      const relevantRoom = await Room.byTenant(req.user.residence)
        .findById(req.body.roomId)
        .lean();

      if (!relevantRoom) {
        res.sendStatus(404);
        return;
      }

      //Check for overlaps
      let responseObject = await checkApprovedOverlaps(
        req,
        req.body.roomId,
        req.body.start,
        req.body.end
      );

      if (responseObject.error === 1) {
        res.status(500).send("Database Error");
      } else if (responseObject.overlaps.length > 0) {
        res.status(400).send("Overlaps detected");
      } else {
        const newBookingRequest = {
          roomId: req.body.roomId,
          description: req.body.description,
          contactNumber: req.body.contactNumber,
          expectedAttendees: req.body.expectedAttendees,
          createdBy: req.user.userId,
          start: req.body.start,
          end: req.body.end,
          approved: constants.approvalStates.Pending
        };

        const roomBooking = RoomBooking.byTenant(req.user.residence);
        const roomBookingInstance = new roomBooking(newBookingRequest);
        roomBookingInstance.save().then(async (result, error) => {
          if (error) {
            res.status(500).send("Database Error");
          } else {
            res.sendStatus(200);
            if (EmailService.isEmailRequired(req.body.end)) {
              const {
                userName,
                userEmail,
                roomName,
                carbonCopy
              } = await EmailService.getEmailDataForBR(
                req.user.userId,
                req.body.roomId,
                req.user.residence
              );

              EmailService.sendSwitcher(
                userName,
                userEmail,
                carbonCopy,
                `[${roomName}] Your booking request has been created`,
                `<p>Dear ${userName}, a new booking request has been created from your account. Please refer to the details below.</p>
                                <p>Your contact: ${userName} / ${userEmail} / ${
                  result.contactNumber
                }</p>
                                <p>Room name: ${roomName}</p>
                                <p>Expected number of attendees/participants: ${
                                  result.expectedAttendees
                                }</p>
                                <p>Booked at: ${result.createdDate.toString()}</p>
                                <p>Start date/time: ${new Date(
                                  req.body.start
                                ).toString()}</p>
                                <p>End date/time: ${new Date(
                                  req.body.end
                                ).toString()}</p>
                                <p>Reason for booking: ${
                                  req.body.description
                                }</p>
                                <p>Current Status: ${
                                  constants.approvalStatesStringMap[
                                    result.approved
                                  ]
                                }</p>
                                <br>
                                <p>Yours Sincerely,</p> 
                                <p>Treeckle Team</p>`
              );
            }
          }
        });
      }
    }
  }
);

//Admin: Test endpoint to delete booking requests by Id
router.delete(
  "/",
  jsonParser,
  [body("bookingId").exists()],
  async (req, res) => {
    const permitted = await isPermitted(
      req.user.role,
      constants.categories.bookingRequestsManagement,
      constants.actions.delete
    );

    //Check for input errors
    const errors = validationResult(req);
    if (!permitted) {
      res.sendStatus(401);
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      RoomBooking.byTenant(req.user.residence)
        .deleteOne({ _id: req.body.bookingId })
        .then(result => {
          if (result.deletedCount > 0) {
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        })
        .catch(err => res.sendStatus(500));
    }
  }
);

module.exports = router;
