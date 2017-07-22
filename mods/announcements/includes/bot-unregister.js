'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    bot.on('message', function (user, userID, channelID, message, event) {
        if (tools.mongoose) {
            if (bot.id !== userID) {
                const registerMsg = `<@!${bot.id}> stop announcements`;
                const channel = bot.channels[channelID];

                if (channel && message === registerMsg) {
                    bot.simulateTyping(channelID, () => {
                        const collection = tools.mongoose.connection.collection('mod_announcements_channels');

                        collection.findOne({ id: channelID }, (err, doc) => {
                            if (!err) {
                                if (!doc) {
                                    bot.sendMessage({ to: channelID, message: `Channel already unregistered.` });
                                } else {
                                    collection.remove({ id: channelID }, (err) => {
                                        if (err) {
                                            bot.sendMessage({ to: channelID, message: `Channel unregistration failed.` });
                                        } else {
                                            bot.sendMessage({ to: channelID, message: `Channel unregistration success.` });
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