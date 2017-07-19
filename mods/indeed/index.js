'use strict'

const fs = require('fs');
const path = require('path');

module.exports = ({ bot, env, pluginConfig }) => {
    const tealcsPath = path.join(__dirname, 'tealcs');
    let indeed = [];

    fs.readdir(tealcsPath, (err, items) => {
        indeed = items;

        bot.on('message', function (user, userID, channelID, message, event) {
            if (bot.id !== userID) {
                if (indeed.length && message.match(/indeed/i)) {
                    const pos = Math.round(Math.random() * (indeed.length - 1));

                    bot.uploadFile({
                        to: channelID,
                        file: path.join(tealcsPath, indeed[pos]),
                        filename: indeed[pos]
                    });
                    console.log('Indeed');
                }
            }
        });
    });
};
