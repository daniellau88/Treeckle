const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const keys = require('../config/keys');
const User = require('../models/authentication/user-model');
const Room = require('../models/room-booking/rooms-model');
const constants = require('../config/constants');
const RoomBooking = require('../models/room-booking/roomBooking-model');
const EmailReceiptsConfig = require('../models/emailReceiptsConfig-model');

// Configure transport options
const mailgunOptions = {
auth: {
    api_key: keys.mailgun.APIkey,
    domain: keys.mailgun.baseURL
    }
}

const transport = mailgunTransport(mailgunOptions)

// EmailService
class EmailService {
constructor() {
    this.emailClient = nodemailer.createTransport(transport)
    }

    sendText(to, subject, html) {
        return new Promise((resolve, reject) => {
        this.emailClient.sendMail({
            from: 'Admin admin@treeckle.com',
            to,
            subject,
            html
        }, (err, info) => {
            if (err) {
            reject(err)
            } else {
            resolve(info)
            }
        });
        });
    }
    

    sendTextWithCC(to, cc, subject, html) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: 'Admin admin@treeckle.com',
                to,
                subject,
                cc,
                html
            }, (err, info) => {
                if (err) {
                reject(err)
                } else {
                resolve(info)
                }
            })
        })
    }

    sendSwitcher(userName, userEmail, carbonCopy, subject, html) {
        if (userName && userEmail && carbonCopy) {
            this.sendTextWithCC(userEmail, carbonCopy, subject, html);
        } else if (userName && userEmail) {
                this.sendText(userEmail, subject, html);
        } else if (carbonCopy) {
            this.sendText(carbonCopy, subject, html);
        }
    }

    async getEmailDataForBR(userId, roomId, residence) {
        try {
            const userDatum = await User.findById(userId).lean();
            const roomDatum = await Room.byTenant(residence).findById(roomId).lean();
            const carbonCopyDatum = await EmailReceiptsConfig.byTenant(residence).findOne({}).lean();

            let userName = null;
            let userEmail = null;
            let roomName = null;
            let carbonCopy = null;

            if (userDatum) {
                userName = userDatum.name;
                userEmail = userDatum.email;
            }

            if (roomDatum) {
                roomName  = roomDatum.name;
            }

            if (carbonCopyDatum) {
                carbonCopy = carbonCopyDatum.email;
            }

            return {
                userName,
                userEmail,
                roomName,
                carbonCopy
            };
        } catch (err) {
            console.log(err);
        }
    }

    isEmailRequired(end) {
        return Date.now() < end;
    }

    async sendRejectionByRequestId(bookingRequestId, residence) {
        try {
            const booking = await RoomBooking.byTenant(residence).findOne({ _id: bookingRequestId }).lean();
            const { userName, userEmail, roomName, carbonCopy } = await this.getEmailDataForBR(booking.createdBy, booking.roomId, residence);
            
            this.sendSwitcher(userName, userEmail, carbonCopy,
                "Your booking request has been updated",
                `<p>Dear ${userName}, an administrator has updated your booking request. Please refer to the details below.</p>
                <p>Your contact: ${userName} / ${userEmail} / ${booking.contactNumber}</p>
                <p>Room name: ${roomName}</p>
                <p>Expected number of attendees/participants: ${booking.expectedAttendees}</p>
                <p>Booked at: ${booking.createdDate.toString()}</p>
                <p>Start date/time: ${new Date(booking.start).toString()}</p>
                <p>End date/time: ${new Date(booking.end).toString()}</p>
                <p>Reason for booking: ${booking.description}</p>
                <p>Previous Status: ${constants.approvalStatesStringMap[booking.approved]} &raquo; <b>New Status: ${constants.approvalStatesStringMap[constants.approvalStates.Rejected]}</b></p>
                <br>
                <p>Yours Sincerely,</p> 
                <p>Treeckle Team</p>`
            );
            
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new EmailService()