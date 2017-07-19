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
                message: `HEY <@!${userID}>! DON'T SHOUT! THAT'S NOT NICE!`
            });
            console.log(`STAHP! ${message}`);
        }
    });
};
