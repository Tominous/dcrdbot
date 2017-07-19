'use strict'

module.exports = ({ bot, env, manifest }) => {
    bot.on('ready', function () {
        console.log(`Logged in as '${bot.username}' - '${bot.id}'\n`);
    });
}