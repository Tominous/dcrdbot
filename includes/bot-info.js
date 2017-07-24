/**
 * @file includes/bot-info.js
 * @author Alejandro Dario Simi
 */
'use strict'

module.exports = ({ bot, env, manifest }) => {
    let pattern = /^!dcrdbot(| (info|services))$/

    class BotInfo {
        static basicTriggers() {
            return '```\nTry using it as:\n\t- !dcrdbot info\n\t- !dcrdbot services\n```';
        }
        static info() {
            return '`@TODO`';
        }
        static services() {
            return '`@TODO`';
        }
    }

    bot.on('message', (user, userID, channelID, message, event) => {
        let match = message.match(pattern);
        if (bot.id !== userID && match) {
            let message = '';

            if (!match[1]) {
                message = BotInfo.basicTriggers();
            } else if (match[2] === 'info') {
                message = BotInfo.info();
            } else if (match[2] === 'services') {
                message = BotInfo.services();
            }

            if (message) {
                bot.sendMessage({
                    to: userID,
                    message: message
                });
            }
        }
    });
}