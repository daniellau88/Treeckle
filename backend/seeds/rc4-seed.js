const User = require('../models/authentication/user-model');
const Room = require('../models/room-booking/rooms-model');
const constants = require('../config/constants');
const imageThumbnail = require('image-thumbnail');
const path = require('path');

const seedUsers = async () => {
    const profilePic = await imageThumbnail(path.resolve(path.join(__dirname, '../defaults/avatar.png')), { height:300, width:300, responseType:'buffer'});
    const adminUser = new User({
        email: "rc4@rc4.com",
        name: "RC4 Admin",
        role: constants.roles.Admin,
        residence: constants.residences.RC4,
        participatedEventIds: [],
        subscribedCategories: [],
        profilePic: profilePic,
    });
    await new Promise((resolve, reject) => {
        User.register(adminUser, "rc4rc4rc4", async err => {
            if (err) {
                if (err.name == 'UserExistsError') {
                    console.log('User already exists.');
                    resolve();
                } else {
                    reject(err);
                }
            } else {
                console.log('Users created.');
                resolve();
            }
        })
    });
}

const seedRooms = async () => {
    const adminUser = await User.findOne({ name: "RC4 Admin" });
    const adminUserId = adminUser._id;
    const RC4Room = Room.byTenant(constants.residences.RC4);

    const roomDetails = [{
        name: 'SR1',
        category: 'Seminar Room',
    }, {
        name: 'SR2',
        category: 'Seminar Room',
    }, {
        name: 'SR3',
        category: 'Seminar Room',
    }, {
        name: 'SR4',
        category: 'Seminar Room',
    }, {
        name: 'TR1',
        category: 'Theme Room',
    }, {
        name: 'TR2',
        category: 'Theme Room',
    }];

    const isSeeded = (await RC4Room.findOne(roomDetails[0])) != null;

    if (isSeeded) {
        console.log('Rooms already exists.');
        return;
    }

    const roomObjects = roomDetails.map((roomDetail) => {
        return new RC4Room({
            name: roomDetail.name,
            category: roomDetail.category,
            recommendedCapacity: 6,
            createdBy: adminUserId,
            contactName: 'RC4 Contact',
            contactEmail: 'rc4contact@gmail.com',
        });
    });

    await Promise.all(roomObjects.map(roomObj => {
        return roomObj.save();
    })).then(() => {
        console.log('Rooms created.');
    }).catch(err => {
        console.error('Rooms failed to be created.');
        console.error(err);
    });
}

module.exports = {
    seedUsers,
    seedRooms,
}