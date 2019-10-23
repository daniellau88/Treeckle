const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const keys = require('../config/keys');
const User = require('../models/authentication/user-model');
const Room = require('../models/room-booking/rooms-model');
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
}

module.exports = new EmailService()