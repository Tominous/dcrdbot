'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    bot.on('message', function (user, userID, channelID, message, event) {
        if (tools.mongoose) {
            if (bot.id !== userID) {
                const registerMsg = `<@!${bot.id}> get announcements`;
                const channel = bot.channels[channelID];

                if (channel && message === registerMsg) {
                    bot.simulateTyping(channelID, () => {
                        const collection = tools.mongoose.connection.collection('mod_announcements_channels');

                        collection.findOne({ id: channelID }, (err, doc) => {
                            if (!err) {
                                if (doc) {
                                    bot.sendMessage({ to: channelID, message: `Channel already registered.` });
                                } else {
                                    collection.insert(channel, (err, docs) => {
                                        if (err) {
                                            bot.sendMessage({ to: channelID, message: `Channel registration failed.` });
                                        } else {
                                            bot.sendMessage({ to: channelID, message: `Channel registration success.` });
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
    });
};