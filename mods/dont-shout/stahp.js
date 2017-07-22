'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    const path = tools.path;
    const pattern = /([A-Z0-9-_ ]{10})/; // /^([A-Z0-9 -_:\.\!\?]+)$/
    const ignorePattern = /(.*)(<)(.*)([0-9]+)(>)(.*)$/

    bot.on('message', function (user, userID, channelID, message, event) {
        if (bot.id !== userID) {
            let cleanMessage = message;
            while (cleanMessage.match(ignorePattern)) {
                cleanMessage = cleanMessage.replace(ignorePattern, '$1$2$3$5$6');
            }

            if (cleanMessage.match(pattern)) {
                const author = event.d.author;
                bot.uploadFile({
                    to: channelID,
                    file: path.join(__dirname, 'torgue.png'),
                    filename: 'torgue.png',
                    message: `HEY <@!${userID}>! DON'T SHOUT! THAT'S NOT NICE!`
                });
                console.log(`STAHP! ${message}`);
            }
        }
    });
};
