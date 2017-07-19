'use strict'

const path = require('path');

module.exports = ({ bot, env, pluginConfig }) => {
    const path = require('path');

    bot.on('message', function (user, userID, channelID, message, event) {
        if (bot.id !== userID && message.match(/^([A-Z0-9 -_:\.\!\?]+)$/)) {
            const author = event.d.author;
            bot.uploadFile({
                to: channelID,
                file: path.join(__dirname, 'torgue.png'),
                filename: 'torgue.png',
                message: `HEY <@!${userID}>! DON'T SHOUT! THAT'S NOT NICE!`,
                tts: true
            });
            console.log(`STAHP! ${message}`);
        }
    });
    bot.on('message', function (user, userID, channelID, message, event) {
        if (bot.id !== userID) {/*
            const fs = require('fs');
            fs.writeFileSync(path.join(__dirname, '../../../test.json'), JSON.stringify({
                user, userID, channelID, message, event
            }.null, 2));
            console.log(
                user, userID, channelID, message, event
            );*/
        }
    });
};
