'use strict'

const chalk = require('chalk');

module.exports = ({ bot, env, manifest, configInfo }) => {
    bot.on('ready', function () {
        console.log(`Logged in as '${chalk.green(bot.username)}' - '${chalk.green(bot.id)}'`);
        if (Object.keys(bot.servers).length > 0) {
            console.log(`Listening on these servers:`);
            for (let k in bot.servers) {
                const server = bot.servers[k];
                const member = server.members[bot.id];
                console.log(`\t- '${chalk.green(server.name)}' as '${chalk.green(member.nick)}'`);
            }
        }
        console.log('MongoDB %s.', (configInfo.dbError ? chalk.yellow('inactive') : chalk.green('active')));
    });
}