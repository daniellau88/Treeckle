const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const keys = require('../config/keys');

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
sendText(to, subject, text) {
    return new Promise((resolve, reject) => {
    this.emailClient.sendMail({
        from: '"Admin" admin@treeckle.com',
        to,
        subject,
        text,
    }, (err, info) => {
        if (err) {
        reject(err)
        } else {
        resolve(info)
        }
    })
    })
}
}

module.exports = new EmailService()