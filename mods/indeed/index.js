'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    const fs = tools.fs;
    const path = tools.path;

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
