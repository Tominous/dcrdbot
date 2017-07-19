'use strict'

const { env, manifest } = require('./includes/configs');
const Discord = require('discord.io');

const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
//mongoose.connect(`mongodb://localhost/${dbName}`, {
//    useMongoClient: true
//});
//mongoose.connection.on('error', (err) => {
//    console.log(`${err.name}: ${err.message}`);
//});

if (env.bot && env.bot.token && manifest.mods) {
    const bot = new Discord.Client({
        token: env.bot.token,
        autorun: true
    });

    const piecesParams = {
        bot,
        env,
        manifest
    };

    require('./includes/init-bot')(piecesParams);
    require('./includes/init-mods')(piecesParams);
    require('./includes/triggers')(piecesParams);
} else {
    if (!manifest.mods) {
        console.error('It seems your bot has no mods.');
    } else {
        console.error('You need to configure a Discord bot token.');
    }
}
