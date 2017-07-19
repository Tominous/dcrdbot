'use strict'

module.exports = ({ bot, env, manifest }) => {
    bot.on('message', (user, userID, channelID, message, event) => {
        if (message.match(/^!triggers$/)) {
            let message = '```\n';

            message += `Mods:\n`;
            for (let k in manifest.mods) {
                let mod = manifest.mods[k];
                message += `\t- ${mod.name}: ${mod.brief}\n`;
                if (mod.triggers && mod.triggers.length > 0) {
                    message += `\t\tTriggers: ${mod.triggers.join(', ')}\n`;
                }
                message += `\n`;
            }

            message += '```';

            bot.sendMessage({
                to: userID,
                message: message
            });
        }
    });
}