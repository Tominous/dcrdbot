'use strict'

module.exports = ({ bot, env, manifest }) => {
    bot.on('ready', function () {
        console.log(`Logged in as '${bot.username}' - '${bot.id}'`);
        if (Object.keys(bot.servers).length > 0) {
            console.log(`Listening on these servers:`);
            for (let k in bot.servers) {
                const server = bot.servers[k];
                const member = server.members[bot.id];
                console.log(`\t- '${server.name}' as '${member.nick}'`);
            }
        }
    });
}