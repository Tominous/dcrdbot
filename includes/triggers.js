'use strict'

module.exports = ({ bot, env, manifest }) => {
    bot.on('message', (user, userID, channelID, message, event) => {
        if (bot.id !== userID && message.match(/^!triggers$/)) {
            let message = '```\n';

            message += `Mods:\n`;
            for (let k in manifest.mods) {
                let mod = manifest.mods[k];

                if (mod.hidden || env.hidden && env.hidden.mods.indexOf(mod.name) >= 0) {
                    continue;
                }

                message += `\t- ${mod.name}: ${mod.brief}\n`;
                if (mod.triggers && mod.triggers.length > 0) {
                    message += `\t\tTriggers: ${mod.triggers.join(', ')}\n`;
                }
                message += `\n`;
            }

            message += `\nYou can also try '!dcrdbot' to get more information about this bot.\n`;

            message += '```';

            bot.sendMessage({
                to: userID,
                message: message
            });
        }
    });
}