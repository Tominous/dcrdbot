'use strict'

module.exports = ({ bot, env, pluginConfig }) => {
    const path = require('path');

    bot.on('message', function (user, userID, channelID, message, event) {
        if (bot.id !== userID && message.match(/dayum/i)) {
            bot.uploadFile({
                to: channelID,
                file: path.join(__dirname, 'dayum.jpg'),
                filename: 'damn burger.jpg'
            });
            console.log('Dayum!');
        }
    });
};
